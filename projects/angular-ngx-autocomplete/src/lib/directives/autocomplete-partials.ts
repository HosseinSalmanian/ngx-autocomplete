import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxSuggestionHeader]',
})
export class SuggestionHeaderDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[ngxSuggestionContent]',
})
export class SuggestionContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[ngxSuggestionFooter]',
})
export class SuggestionFooterDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[ngxNoSuggestion]',
})
export class NoSuggestionDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
