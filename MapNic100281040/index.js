console.clear();

let count = 0;
let canHave = true;
let isVip = false;
let purchasedCount = 0;
let startTime = 0;
let stopTime = 0;
let result = 0;
let isRunning = false;

function vc(i){return isVip ? i*2 : i};
function buy(money){count -= money; purchasedCount += money};

world.onPlayerJoin(async({entity}) => {
    console.log("Running [.onPlayerJoin]");
    world.say(`${entity.player.name}进入了地图`);
    Object.assign(entity, {
        particleRate: 125,
        particleLifetime: 15,
        particleVelocity: new GameVector3(0, 0.5, 0),
        particleColor: [
            new GameRGBColor(10, 0, 0),
            new GameRGBColor(5, 5, 0),
            new GameRGBColor(0, 10, 0),
            new GameRGBColor(0, 5, 5),
            new GameRGBColor(0, 0, 10),
        ],
    });
    entity.player.spawnPoint.set(25, 10, 33);
    console.log("[.onPlayerJoin] runned");
});

const i = world.querySelector('#加一-1');
i.enableInteract = true;
i.interactHint = '加一';
i.interactRadius = 3;
i.onInteract(({}) => {count += vc(1)});

const k = world.querySelector('#加五-1');
k.enableInteract = true;
k.interactHint = '加五';
k.interactRadius = 3;
k.onInteract(({entity}) => {if(count >= 100){count += vc(5)}else{entity.player.directMessage('你需要100块钱才可以这样')}});

const j = world.querySelector('#存钱罐-1');
j.enableInteract = true;
j.interactHint = '查看钱的数量';
j.interactRadius = 3;
j.onInteract(({entity}) => {entity.player.directMessage(`钱的数量：${count}`)});

const shop = world.querySelector('#植物商店-1');
shop.enableInteract = true;
shop.interactHint = '商店';
shop.interactColor = new GameRGBColor(0,1,1);
shop.interactRadius = 3;
shop.onInteract(async({entity}) => {
    try {
        const result = await entity.player.dialog({
            type: GameDialogType.SELECT,
            title: "商店",
            content: `行走速度：${Math.floor(entity.player.walkSpeed*100)/100}，奔跑速度：${Math.floor(entity.player.runSpeed*100)/100}`,
            options: ['行走速度+0.02 100元', '奔跑速度+0.04 100元', '全部购买 180元 降价10%', '关闭'],
        });
        if(result.index === 0) {
            if(count >= 100){
                entity.player.walkSpeed += vc(0.02);
                buy(100);
                entity.player.directMessage('购买成功');
            } else {entity.player.directMessage(`钱不够，还差${100-count}元`)};
        }else if(result.index === 1) {
            if(count >= 100){
                entity.player.runSpeed += vc(0.04);
                buy(100);
                entity.player.directMessage('购买成功');
            }else{entity.player.directMessage(`钱不够，还差${100-count}元`)};
        }else if(result.index === 2) {
            if(count >= 100){
                entity.player.walkSpeed += vc(0.02);
                entity.player.runSpeed += vc(0.04);
                buy(180);
                entity.player.directMessage('购买成功');
            }else{entity.player.directMessage(`钱不够，还差${270-count}元`)};
        };
        console.log("Successed");
    } catch {};
});

const shopX = world.querySelector('#植物商店-2');
shopX.enableInteract = true;
shopX.interactHint = '更高级的商店';
shopX.interactColor = new GameRGBColor(1,0,0);
shopX.interactRadius = 3;
shopX.onInteract(async({entity}) => {
    try{
        const result = await entity.player.dialog({
            type: GameDialogType.SELECT,
            title: "商店",
            content: `行走速度：${Math.floor(entity.player.walkSpeed*100)/100}，奔跑速度：${Math.floor(entity.player.runSpeed*100)/100}`,
            options: ['行走速度+0.08 400元', '奔跑速度+0.16 400元', '全部购买 680元 降价15%', '关闭'],
        });
        if(result.index === 0) {
            if(count >= 400){
                entity.player.walkSpeed += vc(0.08);
                buy(400);
                entity.player.directMessage('购买成功');
            }else{entity.player.directMessage(`钱不够，还差${400-count}元`)};
        }else if(result.index === 1) {
            if(count >= 400){
                entity.player.runSpeed += vc(0.16);
                buy(400);
                entity.player.directMessage('购买成功');
            }else{entity.player.directMessage(`钱不够，还差${400-count}元`)};
        }else if(result.index === 2) {
            if(count >= 680){
                entity.player.walkSpeed += vc(0.08);
                entity.player.runSpeed += vc(0.16);
                buy(680);
                entity.player.directMessage('购买成功');
            }else{entity.player.directMessage(`钱不够，还差${680-count}元`)};
        };
    } catch {};
});

const treasure = world.querySelector('#新年金钱堆-1');
treasure.enableInteract = true;
treasure.interactRadius = 2;
treasure.onInteract(({ entity }) => {
    if(canHave){
        count += vc(1000000);
        canHave = false;
        entity.player.directMessage('领取成功');
    }else{entity.player.directMessage('你已经领取过了')};
});

const vip = world.querySelector('#vip办理处-1');
vip.enableInteract = true;
vip.interactHint = '办理vip'
vip.interactRadius = 2;
vip.onInteract(async ({ entity }) => {
    try {
        const result2 = await entity.player.dialog({
            type: GameDialogType.SELECT,
            title: 'vip',
            content: 'Vip可以获得更多权益,确定办理vip',
            options: ['vip的权益是啥?', '办理vip (需要500元)', '我是一名vip?', '不买了，关闭页面'],
        });

        if (result2.index === 0) {
            entity.player.dialog({
                type: GameDialogType.TEXT,
                title: 'vip',
                content: '钱的收入翻倍以及购买得到的属性翻倍',
            });
        } else if (result2.index === 1) {
            if (count >= 500) {
                count -= 500
                isVip = true;
                entity.player.directMessage('办理成功！')
            } else {entity.player.directMessage(`钱不够，还差${500-count}元`)};
        } else if (result2.index === 2) {
            if (isVip) {entity.player.dialog({
                type: GameDialogType.TEXT,
                title: 'vip',
                content: '你是一名vip',
            })} else {entity.player.dialog({
                type: GameDialogType.TEXT,
                title: 'vip',
                content: '你不是一名vip',
            })};
        } else {};
    } catch {};
});

const refund = world.querySelector('#回收站-1');
refund.enableInteract = true;
refund.interactHint = '退款并恢复最初状态';
refund.interactRadius = 2;
refund.onInteract(async ({entity}) => {
    try {
        const refundType = await entity.player.dialog({
            type: GameDialogType.SELECT,
            title: "退款并恢复最初状态",
            content: `当前可退${purchasedCount}元`,
            options: ['确定！', '算了'],
        });
        if (refundType.index === 0) {
            entity.player.walkSpeed = 0.21;
            entity.player.runSpeed = 0.39;
            count += purchasedCount;
            purchasedCount = 0;
        };
    } catch {};
});

const race = world.querySelector('#race-1');
race.onEntityContact(({other}) => {
    if(other.isPlayer){
        if(!isRunning){
            isRunning = true;
            other.player.directMessage('计时开始')
            other.player.cameraDistance = 60;
            startTime = Date.now();
        }
    };
});

const win = world.querySelector('#第一名奖杯-1');
win.onEntityContact(({other}) => {
    isRunning = false;
    other.position.copy(other.player.spawnPoint);
    count += vc(10000000);
    stopTime = Date.now();
    result = (stopTime - startTime) / 1000;
    other.player.cameraDistance = 8.5;
    other.player.directMessage(`你用了${result}秒`);
});

