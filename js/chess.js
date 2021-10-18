/**
 * @typedef MoveOption
 * @type {Object}
 * @param {Number} moveX
 * @param {Number} moveY
 * @param {Number} maxSteps
 */

/**
 * @typedef Positions
 * @type {Array<{x: Number, y: Number}>}
 */

/**
 * @typedef FigureOption
 * @type {Object}
 * @property {String} name
 * @property {String} cssClass
 * @property {Number} playerId
 * @property {Boolean} mainFigure
 * @property {Array<MoveOption>} moves
 * @property {Array<MoveOption>} [beats]
 * @property {Positions} bonusArea
 * @property {FigureOption} [bonusFigure]
 */

/**
 * @typedef PlayerOption
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {Positions & {figure: String}} startPositions
 * @property {Object<String, FigureOption>} figures
 */

/**
 * @typedef ChessOption
 * @type {Object}
 * @property {Number} firstPlayerId
 * @property {Number} fieldWidth
 * @property {Number} fieldHeight
 * @property {Number} stepDelay
 * @property {Number} eventDelay
 * @property {Array<PlayerOption>} players
 */

/**
 * @type {Chess}
 */
const ChessGame = (() => {

    /**
     * @param {Number} playerId
     * @param {FigureOption} figureOption
     * @return {FigureOption}
     */
    function figure(playerId, figureOption) {
        return {
            ...figureOption,
            cssClass: figureOption.cssClass + (playerId === 0 ? ' black' : ' white'),
            playerId: playerId,
        }
    }

    /**
     * @type FigureOption
     */
    const startWhitePawnFigure = {
        name: 'Пешка',
        cssClass: 'figure pawn white',
        playerId: 1,
        mainFigure: false,
        moves: [{moveX: 0, moveY: -1, maxSteps: 2}],
        beats: [
            { moveX: -1, moveY: -1, maxSteps: 1 },
            { moveX:  1, moveY: -1, maxSteps: 1 }
        ],
        bonusArea: [
            ...Array(10).fill(0).map((_, i) => ({x: i, y: 6})),
            ...Array(10).fill(0).map((_, i) => ({x: i, y: 7})),
        ],
        bonusFigure: {
            name: 'Пешка',
            cssClass: 'figure pawn white',
            playerId: 1,
            mainFigure: false,
            moves: [{moveX: 0, moveY: -1, maxSteps: 1}],
            beats: [
                { moveX: -1, moveY: -1, maxSteps: 1 },
                { moveX:  1, moveY: -1, maxSteps: 1 }
            ]
        }
    }

    /**
     * @type FigureOption
     */
    const startBlackPawnFigure = {
        name: 'Пешка',
        cssClass: 'figure pawn black',
        playerId: 0,
        mainFigure: false,
        moves: [{moveX: 0, moveY: 1, maxSteps: 2}],
        beats: [
            { moveX: -1, moveY: 1, maxSteps: 1 },
            { moveX:  1, moveY: 1, maxSteps: 1 }
        ],
        bonusArea: [
            ...Array(10).fill(0).map((_, i) => ({x: i, y: 2})),
            ...Array(10).fill(0).map((_, i) => ({x: i, y: 3})),
        ],
        bonusFigure: {
            name: 'Пешка',
            cssClass: 'figure pawn black',
            playerId: 0,
            mainFigure: false,
            moves: [{moveX: 0, moveY: 1, maxSteps: 1}],
            beats: [
                { moveX: -1, moveY: 1, maxSteps: 1 },
                { moveX:  1, moveY: 1, maxSteps: 1 }
            ]
        }
    }

    /**
     * @type FigureOption
     */
    const knightFigure = {
        name: 'Конь',
        cssClass: 'figure knight',
        playerId: 0,
        mainFigure: false,
        moves: [
            {moveX:  2, moveY:  1, maxSteps: 1},
            {moveX:  2, moveY: -1, maxSteps: 1},
            {moveX: -2, moveY:  1, maxSteps: 1},
            {moveX: -2, moveY: -1, maxSteps: 1},
            {moveX:  1, moveY:  2, maxSteps: 1},
            {moveX:  1, moveY: -2, maxSteps: 1},
            {moveX: -1, moveY:  2, maxSteps: 1},
            {moveX: -1, moveY: -2, maxSteps: 1}
        ]
    }

    /**
     * @type FigureOption
     */
    const bishopFigure = {
        name: 'Слон',
        cssClass: 'figure bishop',
        playerId: 0,
        mainFigure: false,
        moves: [
            {moveX:  1, moveY:  1, maxSteps: 7},
            {moveX:  1, moveY: -1, maxSteps: 7},
            {moveX: -1, moveY:  1, maxSteps: 7},
            {moveX: -1, moveY: -1, maxSteps: 7}
        ]
    }

    /**
     * @type FigureOption
     */
    const rockFigure = {
        name: 'Ладья',
        cssClass: 'figure rock',
        playerId: 0,
        mainFigure: false,
        moves: [
            {moveX:  0, moveY:  1, maxSteps: 7},
            {moveX:  0, moveY: -1, maxSteps: 7},
            {moveX:  1, moveY:  0, maxSteps: 7},
            {moveX: -1, moveY:  0, maxSteps: 7}
        ]
    }

    /**
     * @type FigureOption
     */
    const queenFigure = {
        name: 'Ферзь',
        cssClass: 'figure queen',
        playerId: 0,
        mainFigure: false,
        moves: [
            {moveX:  0, moveY:  1, maxSteps: 7},
            {moveX:  0, moveY: -1, maxSteps: 7},
            {moveX:  1, moveY:  0, maxSteps: 7},
            {moveX: -1, moveY:  0, maxSteps: 7},
            {moveX:  1, moveY:  1, maxSteps: 7},
            {moveX:  1, moveY: -1, maxSteps: 7},
            {moveX: -1, moveY:  1, maxSteps: 7},
            {moveX: -1, moveY: -1, maxSteps: 7}
        ]
    }

    /**
     * @type FigureOption
     */
    const kingFigure = {
        name: 'Король',
        cssClass: 'figure king',
        playerId: 0,
        mainFigure: true,
        moves: [
            {moveX:  0, moveY:  1, maxSteps: 1},
            {moveX:  0, moveY: -1, maxSteps: 1},
            {moveX:  1, moveY:  0, maxSteps: 1},
            {moveX: -1, moveY:  0, maxSteps: 1},
            {moveX:  1, moveY:  1, maxSteps: 1},
            {moveX:  1, moveY: -1, maxSteps: 1},
            {moveX: -1, moveY:  1, maxSteps: 1},
            {moveX: -1, moveY: -1, maxSteps: 1}
        ]
    }


    /**
     * @type {ChessOption}
     */
    const ClassicChessOption = {
        firstPlayerId: 1,
        fieldWidth: 8,
        fieldHeight: 8,
        stepDelay: 100,
        eventDelay: 400,
        players: [
            {
                id: 0,
                name: 'Чёрный игрок',
                startPositions: [
                    ...Array(8).fill(0).map((_, i) => ({x: i, y: 1, figure: 'pawn'})),
                    {x: 0, y: 0, figure: 'rock'},
                    {x: 7, y: 0, figure: 'rock'},
                    {x: 1, y: 0, figure: 'knight'},
                    {x: 6, y: 0, figure: 'knight'},
                    {x: 2, y: 0, figure: 'bishop'},
                    {x: 5, y: 0, figure: 'bishop'},
                    {x: 3, y: 0, figure: 'queen'},
                    {x: 4, y: 0, figure: 'king'},
                ],
                figures: {
                    pawn: startBlackPawnFigure,
                    knight: figure(0, knightFigure),
                    bishop: figure(0, bishopFigure),
                    rock:   figure(0, rockFigure),
                    queen:  figure(0, queenFigure),
                    king:   figure(0, kingFigure)
                }
            },
            {
                id: 1,
                name: 'Белый игрок',
                startPositions: [
                    ...Array(8).fill(0).map((_, i) => ({x: i, y: 6, figure: 'pawn'})),
                    {x: 0, y: 7, figure: 'rock'},
                    {x: 7, y: 7, figure: 'rock'},
                    {x: 1, y: 7, figure: 'knight'},
                    {x: 6, y: 7, figure: 'knight'},
                    {x: 2, y: 7, figure: 'bishop'},
                    {x: 5, y: 7, figure: 'bishop'},
                    {x: 3, y: 7, figure: 'queen'},
                    {x: 4, y: 7, figure: 'king'},
                ],
                figures: {
                    pawn: startWhitePawnFigure,
                    knight: figure(1, knightFigure),
                    bishop: figure(1, bishopFigure),
                    rock:   figure(1, rockFigure),
                    queen:  figure(1, queenFigure),
                    king:   figure(1, kingFigure)
                }
            }
        ]
    }

    /**
     * @typedef ChessEvents
     * @type {'game_win'|'stalemate'}
     */

    /**
     * @typedef CellType
     * @type {'FIGURE' | 'EMPTY', 'BLOCK'}
     */

    /**
     * @readonly
     * @enum {CellType}
     */
    const cellType = {
        figure: 'FIGURE',
        empty: 'EMPTY',
        block: 'BLOCK'
    }

    const emptyCell = {type: cellType.empty}
    const blockCell = {type: cellType.block}

    /**
     * @class Figure
     * @property {Number} x
     * @property {Number} y
     * @property {boolean} canMove
     * @property {boolean} isActive
     * @property {FigureOption} option
     * @property {HTMLElement & {figure: Figure}} element
     * @property {Array<{x: Number, y: Number}>} [possibleMoves]
     * @property {Array<{x: Number, y: Number, beatFigure: Figure}>} [possibleBeats]
     */
    class Figure {

        /**
         * @param {FigureOption} option
         */
        constructor(option) {
            this.x = 0
            this.y = 0
            this.canMove = false
            this.isActive = true
            this.option = option
            this.element = document.createElement('span')
            this.element.figure = this
        }

        /**
         * @param {Number} x
         * @param {Number} y
         * @return {Figure}
         */
        move(x, y) {
            this.x = x
            this.y = y
            this.update()
            return this
        }

        /**
         * @return {Figure}
         */
        update() {
            this.element.className = `${this.option.cssClass} x${this.x} y${this.y}${this.canMove ? ' can_move' : ''}`
            return this
        }

        /**
         * @return {Figure}
         */
        remove() {
            this.element.remove()
            this.isActive = false
            return this
        }

        /**
         * @return {Figure}
         */
        checkBonusPosition() {
            if (this.option.bonusFigure &&
                this.option.bonusArea.findIndex(pos => pos.x === this.x && pos.y === this.y) !== -1) {

                this.option = this.option.bonusFigure
                this.update()
            }
            return this
        }

        /**
         * @return {CellType}
         */
        get type() {
            return cellType.figure
        }
    }

    /**
     * @class Player
     * @property {Chess} game
     * @property {Number} id
     * @property {String} name
     * @property {Positions & {figure: String}} startPosition
     * @property {Object<String, FigureOption>} figures
     */
    class Player {

        /**
         * @param {Chess} game
         * @param {PlayerOption} option
         */
        constructor(game, option) {
            this.game = game
            this.id = option.id
            this.name = option.name
            this.startPosition = option.startPositions
            this.figures = option.figures
        }

        /**
         * Осуществить ход
         * @return {Player}
         */
        step() {
            const figures = this.game.findPlayerFigures(this.id)

            let isCanMove = false
            let isCanBeat = false

            for (let figure of figures) {
                this.game.findAllPossibleMoves(figure)
                this.game.findAllPossibleBeats(figure)
                isCanMove = isCanMove || figure.possibleMoves.length !== 0
                isCanBeat = isCanBeat || figure.possibleBeats.length !== 0
                figure.canMove = figure.possibleMoves.length !== 0 || figure.possibleBeats.length !== 0
                figure.update()
            }

            if (!isCanMove && !isCanBeat) {
                this.game.emit('stalemate')
            }
            return this
        }

        /**
         * @param {Figure} figure
         * @return {Player}
         */
        beatFigure(figure) {
            this.game.resetFigures()
            figure.canMove = true
            figure.update()
            if (!this.game.options.isBeatNecessarily) {
                figure.possibleMoves = [{x: figure.x, y: figure.y}]
            }
            this.game.selectFigure(figure)
            return this
        }
    }

    /**
     * @property {Chess} game
     */
    class ChessEvent extends Event {

        /**
         * @param {String} name
         * @param {Chess} game
         */
        constructor(name, game) {
            super(name)
            this.game = game
        }
    }

    /**
     * @class Chess
     * @property {ChessOption} options
     * @property {HTMLElement} field
     * @property {EventTarget} eventHandler
     * @property {Number} stepsCount
     * @property {Player} currentPlayer
     * @property {Array<Figure>} figures
     * @property {Array<Player>} players
     * @property {Array<Player>} winners
     * @property {Array<HTMLElement>} possibleElements
     */
    class Chess {

        /**
         * @param {HTMLElement} field
         * @param {ChessOption} options
         */
        constructor(field, options = ClassicChessOption) {
            this.field = field
            this.field.classList.add('chess')
            this.eventHandler = new EventTarget()
            this.options = options
            this.players = options.players.map(playerOption => new Player(this, playerOption))
        }

        /**
         * Сброс игры
         * @return {Chess}
         */
        reset() {
            this.field.innerHTML = ''

            this.stepsCount = 0
            this.winners = this.players
            this.figures = []
            for (let player of this.players) {
                for (let pos of player.startPosition) {
                    const figure = new Figure(player.figures[pos.figure]).move(pos.x, pos.y)
                    figure.element.addEventListener('click', event => {
                        this.selectFigure(event.target.figure)
                    })
                    this.field.appendChild(figure.element)
                    this.figures.push(figure)
                }
            }
            return this
        }

        /**
         * Начало игры
         * @return {Chess}
         */
        start() {
            this.nextStep()
            return this
        }

        /**
         * Осуществить следующий ход
         * @return {Chess}
         */
        nextStep() {
            this.resetFigures()
            if (!this.checkWin()) {
                const player = this.players[(this.stepsCount + this.options.firstPlayerId) % this.players.length]
                this.currentPlayer = player
                setTimeout(() => player.step(), this.options.stepDelay)
                this.stepsCount++
            }
            return this
        }

        /**
         * @return {Chess}
         */
        resetFigures() {
            this.hideAll()
            for (let figure of this.figures) {
                figure.canMove = false
                figure.update()
            }
            return this
        }

        /**
         * @param {Figure} figure
         * @param {Number} x
         * @param {Number} y
         * @return {Chess}
         */
        moveFigure(figure, x, y) {
            figure.move(x, y)
            figure.checkBonusPosition()
            this.nextStep()
            return this
        }

        /**
         * @param {Figure} figure
         * @param {Figure} beatFigure
         * @param {Number} x
         * @param {Number} y
         * @return {Chess}
         */
        beatFigure(figure, beatFigure, x, y) {
            beatFigure.remove()
            figure.move(x, y)
            figure.checkBonusPosition()
            this.nextStep()
            return this
        }

        /**
         * @param {Figure} figure
         * @return {Chess}
         */
        selectFigure(figure) {
            if (figure.canMove) {
                this.figures.forEach(figure => figure.element.classList.remove('select'))
                figure.element.classList.add('select')
                this.hideAll()
                const moves = [...figure.possibleMoves, ...figure.possibleBeats]
                for (let move of moves) {
                    const elem = document.createElement('span')

                    this.field.appendChild(elem)
                    elem.className = `move x${move.x} y${move.y}${move.beatFigure ? ' beat' : ''}`

                    elem.addEventListener('click', () => {
                        if (move.beatFigure) {
                            this.beatFigure(figure, move.beatFigure, move.x, move.y)
                        } else {
                            this.moveFigure(figure, move.x, move.y)
                        }
                    })
                }
            }
            return this
        }

        /**
         * @param {Figure} figure
         * @return {Array<{x: Number, y: Number}>}
         */
        findAllPossibleMoves(figure) {
            const possibleMoves = []

            for (let move of figure.option.moves) {
                let x = figure.x
                let y = figure.y

                for (let step = 0; step < move.maxSteps; step++) {
                    x += move.moveX
                    y += move.moveY

                    const nextCell = this.findInCell(x, y)
                    if (nextCell.type === cellType.empty) {
                        possibleMoves.push({x, y})
                    } else {
                        break
                    }
                }
            }

            figure.possibleMoves = possibleMoves

            return possibleMoves
        }

        /**
         * @param {Figure} figure
         * @return {Array<{x: Number, y: Number, beatFigure: Figure}>}
         */
        findAllPossibleBeats(figure) {
            const possibleBeats = []

            const beats = figure.option.beats ?? figure.option.moves

            for (let move of beats) {
                let x = figure.x
                let y = figure.y

                for (let step = 0; step < move.maxSteps; step++) {
                    x += move.moveX
                    y += move.moveY

                    const nextCell = this.findInCell(x, y)
                    if (nextCell.type === cellType.figure && nextCell.option.playerId !== this.currentPlayer.id) {
                        possibleBeats.push({x, y, beatFigure: nextCell})
                        break
                    } else if (nextCell.type !== cellType.empty) {
                        break
                    }
                }
            }

            figure.possibleBeats = possibleBeats

            return possibleBeats
        }

        /**
         * @return {boolean}
         */
        checkWin() {
            this.winners = this.players.filter(
                player => this.figures.findIndex(
                    figure => figure.isActive && figure.option.mainFigure && player.id === figure.option.playerId
                ) !== -1
            )

            if (this.winners.length !== this.players.length) {
                this.emit('game_win')
                return true
            }
            return false
        }

        /**
         * @param {Number} x
         * @param {Number} y
         * @return {Figure | {type: cellType}}
         */
        findInCell(x, y) {
            if (x < 0 || y < 0 || x >= this.options.fieldWidth || y >= this.options.fieldHeight) {
                return blockCell
            }
            for (let figure of this.figures) {
                if (figure.isActive && figure.x === x && figure.y === y) {
                    return figure
                }
            }
            return emptyCell
        }

        /**
         * @param {Number} playerId
         * @return {Array<Figure>}
         */
        findPlayerFigures(playerId) {
            return this.figures.filter(figure => figure.isActive && figure.option.playerId === playerId)
        }

        /**
         * @return {Chess}
         */
        hideAll() {
            this.field.querySelectorAll('.move').forEach(elem => elem.remove())
            return this
        }

        /**
         * @callback CheckerCallback
         * @param {Chess} game
         */

        /**
         * @param {ChessEvents} event
         * @param {CheckerCallback} listener
         * @return {Chess}
         */
        on(event, listener) {
            this.eventHandler.addEventListener(event, e => {
                setTimeout(() => listener(e.game), this.options.eventDelay)
            })
            return this
        }

        /**
         * @param {ChessEvents} event
         * @return {Chess}
         */
        emit(event) {
            this.eventHandler.dispatchEvent(new ChessEvent(event, this))
            return this
        }
    }

    return Chess
})()
