export const removeEnemy = (id, setEnemies) => {
    setEnemies((prev) => {
        const enemy = prev.find((e) => e.id === id);
        if (enemy?.ref?.current && !enemy?.ref?.current.destroyed) {
            enemy.destroyed = true; // Mark as destroyed
            enemy.ref.current.destroy({
                children: true,
            });
        }
        return prev.filter((e) => e.id !== id);
    });
    // console.log(`Enemy with id ${id} removed`);
};
