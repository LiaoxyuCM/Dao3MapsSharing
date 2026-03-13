console.clear()

for(let x = 0; x < 257; x++){
    for(let y = 0; y < 257; y++){
        voxels.setVoxel(x, 8, y, "water");
    }
}

world.onPlayerJoin(({entity}) => {
    console.log("player joined");
    world.say(`${entity.player.name}\(${entity.player.userId}\)进入了地图`);
    entity.player.dialog({
        type: GameDialogType.TEXT,
        title: "相关信息",
        content: 'BGM: Night Snow\n注意: 千万不要用平板或手机玩'
    });
    entity.player.spawnPoint.set(252, 50, 250)
    entity.player.forceRespawn()

    world.removeCollisionFilter('player', 'player');//关闭玩家之间碰撞

    console.log("PPE setupping...");
    Object.assign(entity, {
        particleRate: 125,
        particleLifetime: 15,
        particleVelocity: new GameVector3(0, 0.5, 0),
        particleColor: [
            new GameRGBColor(0,20,10),
            new GameRGBColor(0,15,7.5),
            new GameRGBColor(0,10,5),
            new GameRGBColor(0,5,2.5),
            new GameRGBColor(0,0,0),
        ],
    });
    console.log("PPE setupped");
    entity.onFluidEnter(() => {//当玩家掉到水里
        entity.position.copy(entity.player.spawnPoint);
        entity.position.y += 12;
    });
});

for (const e of world.querySelectorAll('*')) {//遍历所有实体
    if (e.id.startsWith('跑酷存档点')) {//如果当前实体名左边部分刚好是"存档点", 比如 存档点-1 存档点-2...
        e.collides = true //开启碰撞
        e.fixed = true //固定实体不被推移
        e.onEntityContact(({ other }) => { //每当存档点碰到另一个实体
            if (other.isPlayer) { //另一个实体是玩家
                if (e.position !== other.player.spawnPoint) { // 检测当前存档点是否玩家重生点, 避免反复在同一个存档点做多余的保存
                    other.player.spawnPoint = e.position; // 喵家重生点坐标设置成存档点的坐标
                    other.player.directMessage('到达新的重生点'); // 给玩家发消息
                };
            };
        });
    };
    if (e.id.startsWith('第一名奖杯')) {
        e.collides = true;
        e.fixed = true
        e.onEntityContact(({ other }) => {
            if (other.isPlayer) {
                other.player.canFly = true;
                other.player.directMessage('你已通关，获得飞行能力');
            };
        });
    };
};
