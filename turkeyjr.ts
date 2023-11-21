scene.setBackgroundColor(9)
tiles.setTilemap(turkey_imgs.level1)
namespace SpriteKind {
    //% isKind
    export const Rescued = SpriteKind.create()
}


//% color=#4c5857
//% icon="\uf52d"
//% blockGap=8 block="Turkey"
//% weight=99
namespace turkey {

    export let cageLocation: tiles.Location;
    export let freeTurkeys: Sprite = null
    export let bigTurkey: Sprite = null
    export let scoreText = textsprite.create("", 0, 14)
    scoreText.setFlag(SpriteFlag.RelativeToCamera, true)




    /**
     * Run code when the play button is pressed
     * (Like on start, but jr)
     */
    //% color=#093330
    //% help=game/on-start-simple 
    //% weight=99 
    //% afterOnStart=false
    //% blockId=on_start_simple 
    //% block="on `ICON.play`"
    //% blockAllowMultiple=0
    export function onStartSimple(a: () => void): void {
        a();
    }




    /**
    * Make the turkey appear to jump
    */
    //% blockId=turkey_jump
    //% block="`ICON.turkey-right` jump"
    //% help=github:docs/turkey_jump
    export function turkeyJump() {
        bigTurkey.vy = -300
    }

    /**
    * Make the turkey appear to jump
    */
    //% blockId=free_turkey
    //% block="free `ICON.turkey-cage`"
    //% help=github:docs/free_turkey
    export function freeTurkey() {
        /*if (bigTurkey.tileKindAt(TileDirection.Left, assets.tile`cage`)){
            cageLocation = bigTurkey.tilemapLocation().getNeighboringLocation(CollisionDirection.Left)
        }
        if (bigTurkey.tileKindAt(TileDirection.Right, assets.tile`cage`)) {
            cageLocation = bigTurkey.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)
        }
        if (bigTurkey.tileKindAt(TileDirection.Top, assets.tile`cage`)) {
            cageLocation = bigTurkey.tilemapLocation().getNeighboringLocation(CollisionDirection.Top)
        }
        if (bigTurkey.tileKindAt(TileDirection.Bottom, assets.tile`cage`)) {
            cageLocation = bigTurkey.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom)
        }
        if (bigTurkey.tileKindAt(TileDirection.Center, assets.tile`cage`)) {
            cageLocation = bigTurkey.tilemapLocation();
        }*/
        tiles.setTileAt(cageLocation, assets.tile`clear`)
        turkey.freeTurkeys = sprites.create(turkey_imgs.lil, SpriteKind.Rescued)
        tiles.placeOnTile(turkey.freeTurkeys, cageLocation)
        turkey.freeTurkeys.follow(turkey.bigTurkey)
    }

    /**
    * Add the turkey and mechanics to the game
    */
    //% blockId=add_turkey
    //% block="add `ICON.turkey-right`"
    //% help=github:docs/add_turkey
    export function addTurkey() {
        bigTurkey = sprites.create(turkey_imgs.player, SpriteKind.Player)
        controller.moveSprite(bigTurkey, 100, 0)
        bigTurkey.ay = 500
        scene.cameraFollowSprite(bigTurkey)
        tiles.placeOnRandomTile(bigTurkey, assets.tile`start`)
    }

    /**
    * Start the game timer
    */
    //% blockId=turkey_timer
    //% block="start `ICON.clock-white`"
    //% help=github:docs/turkey_timer
    export function turkeyTimer() {
        carnival.startTimer()
    }



    /**
    * Special lose sequence
    */
    //% blockId=set_turkey_lose
    //% block="game over `ICON.frown-open-white`"
    //% group="Game"
    //% help=github:docs/set_turkey_lose
    export function turkeyLoss() {
        game.setGameOverPlayable(false, music.createSoundEffect(WaveShape.Noise, 4173, 1026, 100, 0, 800, SoundExpressionEffect.Warble, InterpolationCurve.Curve), false)
        game.gameOver(false)
    }


    /**
    * Special win sequence
    */
    //% blockId=set_turkey_win
    //% block="game over `ICON.smile-beam-white`"
    //% help=github:docs/set_turkey_win
    export function turkeyWin() {
        //carnival.onGameOverExpanded(carnival.WinTypes.Timed)

        let secs = Math.floor(carnival.getTimerValue() / 1000)
        carnival.customGameOverExpanded("15 cages in " + secs + " seconds!", effects.confetti, music.powerUp, carnival.ScoreTypes.LTime)

    }

    /**
     * Register code run when a controller event occurs
    * @param event
    * @param handler
    */
    //% weight=99 blockGap=8
    //% blockId=ctrlonA block="on `ICON.a-button-white-invert`"
    //% color=#093330
    //% help=docs/on-a
    export function onA(handler: () => void) {
        controller.A.onEvent(ControllerButtonEvent.Pressed, handler)
    }

    /**
 * Runs code once each time [||] reaches a given value. This will also
 * run if the score "passes" the given value in either direction without ever
 * having the exact value (e.g. if score is changed by more than 1)
 *
 * @param score the score to fire the event on
 * @param handler code to run when the score reaches the given value
 */
    //% blockId=gameonscore3
    //% block="on `ICON.turkey-cage` $score"
    //% score.defl=15
    //% help=docs/on_score
    //% color=#093330
    export function onCages(score: number, handler: () => void) {
        info.player1.impl.onScore(score, handler);
    }


    /**
     * Register code run when a controller event occurs
    * @param event
    * @param handler
    */
    //% weight=99 blockGap=8
    //% blockId=on-overlap-cage
    //% block="`ICON.turkey-right` `ICON.point-right-white` `ICON.turkey-cage` || $location"
    //% draggableParameters = "reporter"
    //% color=#093330
    //% help=docs/on-overlap-cage
    export function turkeyOverlapCage(handler: () => void) {
        if (!handler) return;

        const overlapHandler = (sprite: Sprite, location: tiles.Location) => {
            cageLocation = location;
            handler();
        }

        const tileOverlapHandlers = game.currentScene().tileOverlapHandlers;
        tileOverlapHandlers.push(
            new scene.TileOverlapHandler(
                SpriteKind.Player,
                turkey_imgs.cage,
                overlapHandler
            )
        );
    }



    /**
    * Overrides the normal score UI with an iconified version
    */
    //% blockId=set_turkey_override
    //% block="set `ICON.turkey-cage` to $thisScore"
    //% thisScore.defl=0
    //% help=github:docs/set_turkey_override
    export function setScoreOverride(thisScore: number) {
        info.setScore(thisScore)
        turkey.scoreText.setText(" x " + convertToText(info.score()))
        scoreText.setIcon(turkey_imgs.lil)

        //scoreText.setBorder(1, 3, 1)
        scoreText.setMaxFontHeight(9)
        scoreText.right = 160
        scoreText.top = 1
        scoreText.update()
        info.showScore(false)
    }


    /**
    * Changes the score and overrides the traditional UI
    * with an iconified version
    */
    //% blockId=change_turkey_override
    //% block="`ICON.turkey-cage` + $thisScore"
    //% thisScore.defl=1
    //% help=github:docs/change_turkey_override
    export function changeScoreOverride(thisScore: number) {
        info.changeScoreBy(thisScore)
        turkey.setScoreOverride(info.score())
    }

}