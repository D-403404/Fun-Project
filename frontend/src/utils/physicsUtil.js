
export class ColliderData{
    scaleWidth; scaleHeight;

    // Unlike Arcade Physics's assumption, these offsets are counted
    // from the center of the game object not the top left corner of the bounding box
    offsetX; offsetY;

    constructor(scaleWidth=1, scaleHeight=1, offsetX=0, offsetY=0){
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
};

/*
    this.body's fucking weird behavior!!!!
    - body.x and body.y in create() differs from in update()
    (maybe Physics is not loaded yet so this bounding box seems to be half-sized of the sprite 
    including the whole rectangular sprite not just only the texture)
    even though not updating anything
    - use the top left as its position

    NOTE THAT
    - During the 1st frame, preUpdate(): body.width and body.height aren't scaled yet
        until update() they change. So in the next frame's preUpdate() and afterwards, they are updated
    
    - ap.width and ap.height are unchanged, if wanting to use the scaled size, use displayWidth, displayHeight
*/
export class BoxCollider{
    ap;
    constructor(arcadePhysicsObj){ this.ap = arcadePhysicsObj; }

    setData(colliderData){
        if (!colliderData)
            colliderData = new ColliderData();

        /*
            IF USE BOTH OF THESE METHODS AT THE SAME TIME, IT WILL RESULT DIFFERENTLY FROM IT ACTUALLY IS
            due to the offset from the top left of the game object rather than center
            E.g. 
                body.setSize(1/2 width, 1/2 height);    // Set the collider's size to be half of the original
                body.setOffset(0, 20)    // Move the collider to the feet of the player but still centering along the vertical axis
                => But it gives unexpected result (it doesn't take the center as the pivot but the original's top left bounding box)
            So it should be simple if these numbers are adjusted manually one after another (hardcoded)
        */
        this.ap.body.setSize(this.ap.width * colliderData.scaleWidth, this.ap.height * colliderData.scaleHeight, true);

        let updatedOffset = this.ap.body.offset;   // Offsets after being centered in setSize() (set 3rd parameter to `true`)
        let desiredOffset = {
            x: updatedOffset.x + colliderData.offsetX,
            y: updatedOffset.y + colliderData.offsetY
        }
        // console.log(this.ap.body.x, this.ap.body.y, this.ap.body.width, this.ap.body.height);
        // console.log(this.ap.x, this.ap.y, this.ap.width, this.ap.height);
        // console.log('offset1: ', this.ap.body.offset);
        
        this.ap.body.setOffset(desiredOffset.x, desiredOffset.y);
        // console.log(this.ap.body.x, this.ap.body.y, this.ap.body.width, this.ap.body.height);
        // console.log(this.ap.x, this.ap.y, this.ap.width, this.ap.height);
        // console.log('offset2: ', this.ap.body.offset);
    }

    setOffset(offset){
        /* This `offset` input is calculated from the center of the sprite */
        this.centerBody();
        let desiredOffset = {
            x: this.ap.body.offset.x + offset.x,
            y: this.ap.body.offset.y + offset.y
        }
        this.ap.body.setOffset(desiredOffset.x, desiredOffset.y);
    }

    setOffsetX(offsetX){
        let currentOffsetY = this.ap.body.offset.y;     // This assumes offsetY is center adjusted
        this.centerBody();
        let centerOffset = this.ap.body.offset;
        let desiredOffset = {
            x: centerOffset.x + offsetX,
            y: currentOffsetY
        }
        this.ap.body.setOffset(desiredOffset.x, desiredOffset.y);
    }

    setOffsetY(offsetY){
        let currentOffsetX = this.ap.body.offset.x;     // This assumes offsetX is center adjusted
        this.centerBody();
        let centerOffset = this.ap.body.offset;
        let desiredOffset = {
            x: currentOffsetX,
            y: centerOffset.y + offsetY
        }
        this.ap.body.setOffset(desiredOffset.x, desiredOffset.y);
    }

    centerBody(){
        /*
            Get the offset when centering the box (box's center overlaps game object's center)
            This function should be used in the update() not during create() as the body's sizes are not scaled yet
        */

        // I'm NOT sure if it's right: REMEMBER TO SCALE DOWN THE BODY'S WIDTH AND HEIGHT!!
        // because after applied scaled, the body's sizes are scaled but not the game object's one        
        this.ap.body.setOffset(
            (this.ap.width - this.ap.body.width / this.ap.scaleX) / 2,
            (this.ap.height - this.ap.body.height / this.ap.scaleY) / 2,
        );
        // or
        // this.ap.body.setOffset(
        //     (this.ap.displayWidth - this.ap.body.width) / 2 / this.ap.scaleX,
        //     (this.ap.displayHeight - this.ap.body.height) / 2 / this.ap.scaleY,
        // );
    }
}