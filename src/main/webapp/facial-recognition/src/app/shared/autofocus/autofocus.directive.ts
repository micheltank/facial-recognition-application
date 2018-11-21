import { Directive, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Por que nao usar apenas o atributo HTML5 padrao autofocus? Porque
 * o autofocus nativo é ativado 1x após o document.onload apenas, e precisamos
 * que o focus seja dado todas as vezes que o ngAfterViewInit for chamado.
 */
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.elRef) {
      const inputEl: any = this.elRef.nativeElement;
      try {
        inputEl.focus();
      } catch (e) {
        // elemento nao suporta focus, apenas ignora o erro
      }
    }
  }
}
