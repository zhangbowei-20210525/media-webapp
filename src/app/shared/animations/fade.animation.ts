import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

/*
* DSL
* */
export const fadeInAnimation = animation([
    // start
    style({
        opacity: 0
    }),
    // end
    animate(
        '200ms',
        style({
            opacity: 1,
        })
    )
]);

export const fadeOutAnimation = animation(
    animate(
        '200ms',
        style({ opacity: 0 })
    )
);

export const fadeIn = trigger('fadeIn', [
    transition('void => *', useAnimation(fadeInAnimation))
]);

export const fadeOut = trigger('fadeOut', [
    transition('* => void', useAnimation(fadeOutAnimation))
]);

export const fadeInOut = trigger('fadeInOut', [
    transition('void => *', useAnimation(fadeInAnimation)),
    transition('* => void', useAnimation(fadeOutAnimation))
]);
