import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent, iif, merge, of, OperatorFunction, Subject } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  NoSuggestionDirective,
  SuggestionContentDirective,
  SuggestionFooterDirective,
  SuggestionHeaderDirective,
} from '../../directives/autocomplete-partials';

type TSuggestion<T> = string | number | T | null;

@Component({
  selector: 'ngx-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line no-use-before-define
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  encapsulation:ViewEncapsulation.None
})
export class AutocompleteComponent<T>
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @Input() minimumCharacterForSearch: number = 0;

  @Input() debounceTime: number = 500;

  @Input() suggestionItemClass!: string;

  @Input() suggestionContainerHeight: number = 150;

  @Input() searchMethod!: OperatorFunction<string, T[]> | null | undefined;

  @Input() suggestionKey!: keyof T;

  @Input() suggestionMethod!: (item?: T) => string;

  @Input() idKey: keyof T = 'id' as keyof T;

  @Input() viewKey!: keyof T;

  @Input() viewMethod!: (selection?: T) => string;

  @Input() placeholder!: string;

  @Input() autocomplete: 'off' | 'on' = 'off';

  @Input() noSuggestionText: string = 'no item found.';

  @Input() clearButton: boolean = true;

  @Input() fitOverlayWidth: boolean = false;

  @Input()
  set forceSuggestion(value: any) {
    this._forceSuggestion = coerceBooleanProperty(value);
  }

  @Output() suggestionSelect = new EventEmitter<T | string | null>();

  highlightIndex!: number;
  viewValue: string = '';
  showSuggestions: boolean = false;
  showClearButton: boolean = false;
  items!: Array<T>;
  suggestions!: Array<string>;
  isLoading: boolean = false;
  term: string = '';
  disabled: boolean = false;
  overlayStyles: null | { [key: string]: any } = null;

  @ContentChild(SuggestionHeaderDirective)
  suggestionHeader!: SuggestionContentDirective;
  @ContentChild(SuggestionContentDirective)
  suggestionContent!: SuggestionContentDirective;
  @ContentChild(SuggestionFooterDirective)
  suggestionFooter!: SuggestionFooterDirective;
  @ContentChild(NoSuggestionDirective)
  noSuggestionDirective!: NoSuggestionDirective;

  @ViewChild('inputElement') private _inputElem!: ElementRef<HTMLInputElement>;

  private _forceSuggestion!: boolean;
  private _destroy$: Subject<void> = new Subject<void>();
  private _destroySearchMethod$: Subject<void> = new Subject<void>();
  private _selectedItem!: T | null;
  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this.viewValueSetter(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngAfterViewInit(): void {
    this.subscribeToUserInput();
  }

  onInputKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.moveHighlightUp();
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.moveHighlightDown();
        event.preventDefault();
        break;
      case 'Escape':
        this.collapseSuggestions();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'Tab':
        this.selectSuggestion();
        break;
      case 'Enter':
        if (this.showSuggestions) this.selectSuggestion();
        else this.expandSuggestions();
        event.preventDefault();
        break;
    }
  }

  onInputBlur(): void {
    if (this.showSuggestions) {
      this.collapseSuggestions();
    }

    this.handleForceSelection();
    this.destroyAfterBlur();
  }

  handleForceSelection() {
    if (this.forceSuggestion) {
      if (!this._selectedItem) this.clear();
    } else this.modelValueSetter(this.viewValue);
  }

  onSuggestionClick(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.highlightedIndex = index;
    this.selectSuggestion();
  }

  trackById(index: number, item: T): any {
    return item[this.idKey];
  }

  clear() {
    this.modelValueSetter(null);
    this.collapseSuggestions();
    this.showClearButton = false;
    this._selectedItem = null;
  }

  onClear(event: MouseEvent) {
    event.preventDefault();
    this.clear();
  }

  onContainerBlur(): void {
    this._onTouched();
  }

  setClearButtonVisibility() {
    this.showClearButton =
      this.clearButton && !!this.viewValue && !this.isLoading && !this.disabled;
  }

  set highlightedIndex(value: number) {
    this.highlightIndex = value;
  }

  get forceSuggestion(): boolean {
    return this._forceSuggestion;
  }

  get highlightedIndex(): number {
    return this.highlightIndex;
  }

  private renderSuggestion(item: T): string {
    if (this.suggestionMethod) return this.suggestionMethod(item);
    if (null != this.suggestionKey) return String(item[this.suggestionKey]);

    return this.renderViewValue(item) || String(this.getModelObject(item));
  }

  private viewValueSetter(value: string | number | T): void {
    this.viewValue = this.renderViewValue(value);
    // todo handle setValue if you want show default value
    if (!this.viewValue) {
      this._selectedItem = null;
    }
  }

  private modelValueSetter(value: TSuggestion<T>): void {
    const val = this.renderModelValue(value);
    this.viewValue = this.renderViewValue(value);
    this._onChange(val);
    this.suggestionSelect.emit(val);
  }

  private renderModelValue(value: TSuggestion<T>): string | T | null {
    return !this.forceSuggestion && 'string' === typeof value
      ? value
      : this.getModelObject(value as number | T | null);
  }

  private collapseSuggestions(): void {
    if (!this.showSuggestions) return;
    this.showSuggestions = false;
  }

  private getModelObject(value: number | T | null): T | null {
    if (null == value || -1 === value) return null;
    return 'number' === typeof value ? this.items[value] : value;
  }

  private renderViewValue(value: TSuggestion<T>): string {
    if (null == value || -1 === value) return '';
    switch (typeof value) {
      case 'string':
        return value.trim();
      case 'number':
        return this.getViewFromObject(this.items[value]);
      default:
        return this.getViewFromObject(value);
    }
  }

  private getViewFromObject(obj: T): string {
    if (this.viewMethod) return this.viewMethod(obj);
    if (null != this.viewKey) return String(obj[this.viewKey]);
    return String(obj);
  }

  private selectSuggestion(): void {
    if (null == this.highlightedIndex || 0 > this.highlightedIndex) return;
    const selectedSuggestion = this.items[this.highlightedIndex];
    this._selectedItem = selectedSuggestion;
    if (selectedSuggestion) {
      this.modelValueSetter(this.highlightedIndex);
    }
    this.collapseSuggestions();
  }

  private expandSuggestions(): void {
    if (!this.showSuggestions) this.showSuggestions = true;
    this.setOverlayWidth();
  }

  private moveHighlightUp(): void {
    if (0 > this.highlightedIndex) {
      this.highlightedIndex = this.items?.length ? this.items.length - 1 : -1;
      return;
    }
    this.highlightedIndex =
      0 === this.highlightedIndex ? -1 : this.highlightedIndex - 1;
  }

  private moveHighlightDown(): void {
    if (0 > this.highlightedIndex) {
      this.highlightedIndex = this.items?.length ? 0 : -1;
      return;
    }
    this.highlightedIndex =
      this.items.length - 1 === this.highlightedIndex
        ? -1
        : this.highlightedIndex + 1;
  }

  private setOverlayWidth() {
    if (!this.fitOverlayWidth) return;

    this.overlayStyles = {
      width: this._inputElem.nativeElement.offsetWidth + 'px',
    };
  }

  private inputHandler(typedValue: string): void {
    this.viewValueSetter(typedValue.trim());
  }

  private get inputObservableValue() {
    return fromEvent<InputEvent>(this._inputElem?.nativeElement, 'input').pipe(
      tap(() => (this._selectedItem = null)),
      debounceTime(this.debounceTime),
      map($e => ($e.target as HTMLInputElement).value),
      distinctUntilChanged((current, previous) => previous === this.term)
    );
  }

  private get focusObservableValue() {
    return fromEvent<InputEvent>(this._inputElem?.nativeElement, 'focus').pipe(
      map($e => ($e.target as HTMLInputElement).value)
    );
  }

  private subscribeToUserInput() {
    merge(this.inputObservableValue, this.focusObservableValue)
      .pipe(
        tap(value => {
          this.hideLoading();
          this.term = value;
        }),
        filter(value => value.length >= this.minimumCharacterForSearch),
        tap(value => {
          this.showLoading();
          this.suggestions = [];
          this.inputHandler(value);
        }),
        switchMap(value => {
          return iif(
            () => !!this._selectedItem,
            of(this._selectedItem ? [this._selectedItem] : []),
            of(value).pipe(
              this.searchMethod ? this.searchMethod : () => of([]),
              takeUntil(this._destroySearchMethod$)
            )
          );
        }),
        finalize(() => this.hideLoading()),
        takeUntil(this._destroy$)
      )
      .subscribe(searchResult => {
        this.hideLoading();
        this.items = searchResult;
        this.suggestions = this.items.map(e => this.renderSuggestion(e));
        this.highlightedIndex = this.items?.length ? 0 : -1;
        this.expandSuggestions();
      });
  }

  private destroyAfterBlur() {
    this._destroySearchMethod$.next();
    this.hideLoading();
  }

  private showLoading() {
    this.isLoading = true;
    this.setClearButtonVisibility();
  }

  private hideLoading() {
    this.isLoading = false;
    this.setClearButtonVisibility();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._destroySearchMethod$.complete();
  }
}
