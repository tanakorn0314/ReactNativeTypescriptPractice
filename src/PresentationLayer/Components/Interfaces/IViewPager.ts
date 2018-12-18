import { ScrollState } from '../ViewPager';

export interface PageScrollEvent {
    offset: number;
    position: number;
}

export interface PageSelectedEvent {
    position: number;
}

export interface PageStateChangedEvent {
    state: ScrollState;
}