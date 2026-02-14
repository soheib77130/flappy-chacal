game.TitleScreen = me.ScreenObject.extend({
    init: function(){
        this._super(me.ScreenObject, 'init');
        this.font = null;
        this.ground1 = null;
        this.ground2 = null;
        this.logo = null;
        this.selectedDifficulty = game.data.difficulty;
    },

    changeDifficulty: function(difficulty) {
        this.selectedDifficulty = difficulty;
        game.data.difficulty = difficulty;
    },

    onResetEvent: function() {
        me.audio.stop("theme");
        game.data.newHiScore = false;

        me.game.world.addChild(new BackgroundLayer('bg', 1));
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", true);
        me.input.bindKey(me.input.KEY.UP, "difficultyUp", true);
        me.input.bindKey(me.input.KEY.DOWN, "difficultyDown", true);
        me.input.bindKey(me.input.KEY.NUM1, "difficultyNormal", true);
        me.input.bindKey(me.input.KEY.NUM2, "difficultyExtreme", true);
        if (me.input.KEY.ONE) { me.input.bindKey(me.input.KEY.ONE, "difficultyNormal", true); }
        if (me.input.KEY.TWO) { me.input.bindKey(me.input.KEY.TWO, "difficultyExtreme", true); }
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        var that = this;
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action) {
            if (action === "enter") {
                me.state.change(me.state.PLAY);
            }
            if (action === "difficultyUp" || action === "difficultyNormal") {
                that.changeDifficulty("normal");
            }
            if (action === "difficultyDown" || action === "difficultyExtreme") {
                that.changeDifficulty("extreme");
            }
        });

        //logo
        this.logo = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2 - 20,
            {image: 'logo'}
        );
        me.game.world.addChild(this.logo, 10);

        me.pool.pull("me.Tween", this.logo.pos)
            .to({y: me.game.viewport.height/2 - 100}, 1000)
            .easing(me.Tween.Easing.Exponential.InOut)
            .start();

        this.ground1 = me.pool.pull("ground", 0, me.video.renderer.getHeight() - 96);
        this.ground2 = me.pool.pull("ground", me.video.renderer.getWidth(),
                                    me.video.renderer.getHeight() - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        me.game.world.addChild(new (me.Renderable.extend ({
            init: function() {
                this._super(me.Renderable, 'init', [0, 0, 100, 100]);
                this.font = new me.Font('gamefont', 20, '#000');
                this.titleFont = new me.Font('gamefont', 24, '#000');
            },
            draw: function (renderer) {
                var playText = me.device.touch ? 'Touchez pour démarrer' : 'Espace/Entrée pour démarrer';
                var muteText = 'Appuyez sur M pour couper/réactiver le son';
                var menuText = 'Choisissez une difficulté : ↑/↓ ou 1/2';
                var normalText = (game.data.difficulty === 'normal' ? '> ' : '  ') + '1 - Mode normal';
                var extremeText = (game.data.difficulty === 'extreme' ? '> ' : '  ') + '2 - Mode EXTREME';

                this.titleFont.draw(renderer, menuText, 190, me.game.viewport.height/2 + 30);
                this.font.draw(renderer, normalText, 250, me.game.viewport.height/2 + 65);
                this.font.draw(renderer, extremeText, 250, me.game.viewport.height/2 + 95);
                this.font.draw(renderer, playText, 230, me.game.viewport.height/2 + 145);
                this.font.draw(renderer, muteText, 170, me.game.viewport.height/2 + 175);
            }
        })), 12);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.NUM1);
        me.input.unbindKey(me.input.KEY.NUM2);
        if (me.input.KEY.ONE) { me.input.unbindKey(me.input.KEY.ONE); }
        if (me.input.KEY.TWO) { me.input.unbindKey(me.input.KEY.TWO); }
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        me.game.world.removeChild(this.logo);
        this.logo = null;
    }
});
