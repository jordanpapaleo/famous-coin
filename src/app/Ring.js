import View     from 'famous-creative/display/View';

const Curves         = FamousPlatform.transitions.Curves;

export class Ring extends View {
    constructor(node, options) {
        super(node);

        let ringSize = this._getRingSize();
        let ringColor = this._getRingColors();

        this.model = {};

        this.setOrigin(.5, 0);
        this.setAlign(.5, 0);
        this.setMountPoint(.5, .5);
        this.setPositionY(175);
        this.setOpacity(0);
        this.setSizeModeAbsolute();
        this.setAbsoluteSize(50 * ringSize, 50 * ringSize);

        this.createDOMElement({
            properties: {
                width: '100%',
                height: '100%',
                borderColor: ringColor,
                borderRadius: '50%',
                borderStyle: 'solid',
                borderWidth: ringSize
            }
        });

        this._setRingPosition();
    }

    _setRingPosition() {
        const xMax = window.innerWidth / 2;
        const yMax = window.innerHeight / 2;
        this.model.positionX = Math.random() * (xMax * 2) - xMax;
        this.model.positionY  = Math.random() * (yMax * 2) - yMax;
    }

    _getRingColors() {
        const colors = ['#329978', '#0089e0', '#3980a8','#da695b'];
        return colors[Math.floor(Math.random() * colors.length)]
    }

    _getRingSize() {
        const ringSizes = [1, 2, 3];
        return ringSizes[Math.floor(Math.random() * ringSizes.length)];
    }

    exit() {
        /*this.model.endpointX = 0;
        this.model.endpointY = 0;
        this.model.sizeX = 0;
        this.model.sizeY = 0;*/

        let xPos = 0;
        let yPos = window.innerHeight - 225;

        console.log(xPos,yPos);

        this.setDOMProperties({
            borderColor: 'black'
        });

        this.setAbsoluteSize(70, 70, 0, {
            duration: 500
        });

        this.setPositionX(xPos, {
            duration: 500,
            curves: Curves.easeIn
        });

        this.setPositionY(yPos, {
            duration: 500,
            curves: Curves.easeOut
        }, function() {
            this.setOpacity(0);
            this.emit('spinCoin');
        }.bind(this));
    }

    morphColor() {

    }

    sink() {
        let y = this.getPositionY();
        this.x = this.getPositionX();
        this.sinkDuration = 2000;
        this.swayFrequency = 10;
        this.swayRunningDuration = 0;

        this._sway(this.x);
        this.setPositionY(y + window.innerHeight / 4, {
            duration: this.sinkDuration
        }, function() {
            this.exit();
            //setTimeout(this.exit, Math.random() * (500))
        }.bind(this));
    }

    _sway(x) {
        let duration = this.sinkDuration / this.swayFrequency;
        this.swayRunningDuration += duration;

        this.setPositionX(x, {
            duration
        }, function() {
            if(this.swayRunningDuration < this.sinkDuration) {
                if(x < this.x) {
                    this._sway(x + 10);
                } else {
                    this._sway(x - 10);
                }
            }
        }.bind(this));
    }

    pop() {

    }
}
