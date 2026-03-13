world.onPlayerJoin(({entity}) => {
    entity.player.dialog(
        {
            type: GameDialogType.TEXT,
            title: "获取",
            content: "Q群181954795获取\n允许\n（里面的所有素材均来自dao3.fun）"
        }
    );
});

const get_rspack = world.querySelector("#苦力怕-1");
get_rspack.enableInteract = true;
get_rspack.interactHint = "获取Box3的MC-JE材质包";
get_rspack.interactColor = new GameRGBColor(0, 0, 1);
get_rspack.onInteract(({entity}) => {
    entity.player.dialog(
        {
            type: GameDialogType.TEXT,
            title: "获取",
            content: "Q群181954795获取\n或者https://github.com/LiaoxyuCM/mc_rsp_of_b3p/releases/latest\n允许外传\n（里面的所有素材均来自dao3.fun）"
        }
    );
});
