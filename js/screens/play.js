game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        me.audio.play("theme", true);
        var vol = me.device.ua.indexOf("Firefox") !== -1 ? 0.3 : 0.5;
        me.audio.setVolume(vol);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        var difficulty = game.data.difficultySettings[game.data.difficulty];

        me.game.reset();
        me.audio.stop("theme");
        if (!game.data.muted){
            me.audio.play("theme", true);
        }

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        game.data.score = 0;
        game.data.steps = 0;
        game.data.start = false;
        game.data.newHiscore = false;

        me.game.world.addChild(new BackgroundLayer('bg', 1));

        if (difficulty.dangerTheme) {
            this.dangerOverlay = new (me.Renderable.extend({
                init: function() {
                    this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
                    this.floating = true;
                    this.font = new me.Font('gamefont', 24, '#ff1b1b');
                },
                draw: function(renderer) {
                    renderer.setColor('rgba(180, 0, 0, 0.18)');
                    renderer.fillRect(0, 0, me.game.viewport.width, me.game.viewport.height);
                    this.font.draw(renderer, 'MODE EXTREME', 20, 20);
                }
            }));
            me.game.world.addChild(this.dangerOverlay, 9);
        }

        this.ground1 = me.pool.pull('ground', 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull('ground', me.game.viewport.width,
            me.game.viewport.height - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);

        this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height/2 - 100);
        me.game.world.addChild(this.bird, 10);

        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);

        this.getReady = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'getready'}
        );
        me.game.world.addChild(this.getReady, 11);

        var that = this;
        new me.Tween(this.getReady).to({alpha: 0}, 1500)
            .easing(me.Tween.Easing.Linear.None)
            .onComplete(function() {
                game.data.start = true;
                me.game.world.addChild(new game.PipeGenerator(), 0);
                me.game.world.removeChild(that.getReady);
            }).start();
    },

    onDestroyEvent: function() {
        me.audio.stopTrack('theme');
        this.HUD = null;
        this.bird = null;
        this.ground1 = null;
        this.ground2 = null;
        this.dangerOverlay = null;
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});
