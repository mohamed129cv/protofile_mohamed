import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSkelton]',
  standalone: true
})
export class SkeltonDirective implements AfterViewInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {

    // initial state
    this.renderer.addClass(this.el.nativeElement, 'skeleton');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          // remove skeleton
          this.renderer.removeClass(this.el.nativeElement, 'skeleton');

          // add show animation
          this.renderer.addClass(this.el.nativeElement, 'show');

        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(this.el.nativeElement);
  }
}