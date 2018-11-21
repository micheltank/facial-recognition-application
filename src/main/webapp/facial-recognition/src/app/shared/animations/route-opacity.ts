import {
  trigger,
  transition,
  query,
  style,
  animate
} from '@angular/animations';

/**
 * Animação para a troca de rotas, exemplo de uso:
 * <section [@routeOpacity]="ro.isActivated ? ro.activatedRoute : ''">
 *  <router-outlet #ro="outlet">
 *  </router-outlet>
 * </section>
 *
 * CSS:
 * router-outlet ~ * {
 * position: absolute;
 * height: 100%;
 * width: 100%;
 * transform: translateX(0);
 * }
 *
 */
export const routeOpacity = trigger('routeOpacity', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          // transform: 'translateX(-100%)',
          opacity: 0
        })
      ],
      {
        optional: true
      }
    ),
    query(
      ':leave',
      [
        animate(
          '0.200s ease-out',
          style({
            // transform: 'translateX(100%)',
            opacity: 0
          })
        )
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        animate(
          '0.400s cubic-bezier(.57,.96,.66,.9)',
          style({
            // transform: 'translateX(0)',
            opacity: 1
          })
        )
      ],
      { optional: true }
    )
  ])
]);
