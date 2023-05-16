import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tseSuggestionHeader]',
})
export class SuggestionHeaderDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[tseSuggestionContent]',
})
export class SuggestionContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[tseSuggestionFooter]',
})
export class SuggestionFooterDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[tseNoSuggestion]',
})
export class NoSuggestionDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
