export class PlayerAnimator {
    actions;
    current = null;
    constructor(actions) {
        this.actions = actions;
    }
    getAction(state) {
        if (!this.actions[state])
            return null;
        return this.actions[state];
    }
    set(state) {
        const next = this.getAction(state);
        if (!next || next === this.current)
            return;
        next.reset().play();
        if (this.current) {
            this.current.crossFadeTo(next, 0.15, false);
        }
        this.current = next;
    }
}
//# sourceMappingURL=playerAnimator.js.map