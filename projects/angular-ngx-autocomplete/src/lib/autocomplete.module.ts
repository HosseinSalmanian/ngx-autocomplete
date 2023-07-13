import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import {
  NoSuggestionDirective,
  SuggestionContentDirective,
  SuggestionFooterDirective,
  SuggestionHeaderDirective,
} from './directives/autocomplete-partials';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AutocompleteComponent,
    SuggestionHeaderDirective,
    NoSuggestionDirective,
    SuggestionFooterDirective,
    SuggestionContentDirective,
  ],
  imports: [CommonModule, OverlayModule],
  exports: [
    AutocompleteComponent,
    SuggestionHeaderDirective,
    NoSuggestionDirective,
    SuggestionFooterDirective,
    SuggestionContentDirective,
  ],
})
export class AutocompleteModule {}
