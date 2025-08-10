function useCollision(ref1, ref2, collideFn) {
    if (!ref1.current || !ref2.current) {
        return false;
    }

    const bounds1 = ref1.current.getBounds();
    const bounds2 = ref2.current.getBounds();

    const isColliding =
        bounds1.x <= bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width >= bounds2.x &&
        bounds1.y <= bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height >= bounds2.y;

    if (isColliding) {
        collideFn();
    }
}

export default useCollision;
