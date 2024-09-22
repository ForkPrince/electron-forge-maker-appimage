"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maker_base_1 = __importDefault(require("@electron-forge/maker-base"));
const appBuilder = __importStar(require("app-builder-lib/out/util/appBuilder"));
const fs_1 = require("fs");
const package_json_1 = __importDefault(require("../package.json"));
const path_1 = __importDefault(require("path"));
const isIForgeResolvableMaker = (maker) => maker.hasOwnProperty("name");
class MakerAppImage extends maker_base_1.default {
    constructor() {
        super(...arguments);
        this.name = "appImage";
        this.defaultPlatforms = ["linux"];
    }
    isSupportedOnCurrentPlatform() {
        return process.platform === "linux";
    }
    make(_a) {
        return __awaiter(this, arguments, void 0, function* ({ dir, // /home/build/Software/monorepo/packages/electron/out/name-linux-x64
        appName, // name
        makeDir, // /home/build/Software/monorepo/packages/electron/out/make
        targetArch, // x64
        packageJSON, targetPlatform, // linux
        forgeConfig }) {
            var _b, _c;
            const appPath = path_1.default.join(makeDir, `${appName}-${packageJSON.version}-${targetArch}.AppImage`);
            const executable = forgeConfig.packagerConfig.executableName || appName;
            const iconPath = path_1.default.join(path_1.default.dirname(require.resolve("app-builder-lib")), "../templates/icons/electron-linux");
            let config = {
                icons: [
                    { file: `${iconPath}/16x16.png`, size: 16 },
                    { file: `${iconPath}/32x32.png`, size: 32 },
                    { file: `${iconPath}/48x48.png`, size: 48 },
                    { file: `${iconPath}/64x64.png`, size: 64 },
                    { file: `${iconPath}/128x128.png`, size: 128 },
                    { file: `${iconPath}/256x256.png`, size: 256 }
                ]
            };
            const maker = forgeConfig.makers.find(maker => isIForgeResolvableMaker(maker) && maker.name === package_json_1.default.name);
            if (maker !== undefined && isIForgeResolvableMaker(maker))
                config = Object.assign(Object.assign({}, config), maker.config);
            const mimeTypes = ((_c = (_b = forgeConfig.packagerConfig) === null || _b === void 0 ? void 0 : _b.protocols) !== null && _c !== void 0 ? _c : []).flatMap((p) => p.schemes.map((s) => "x-scheme-handler/" + s.toLowerCase()));
            const metadata = {
                Name: appName,
                Exec: executable,
                Terminal: "false",
                Type: "Application",
                Icon: executable,
                StartupWMClass: packageJSON.productName,
                "X-AppImage-Version": packageJSON.version,
                Comment: packageJSON.description,
                Categories: "Utility",
                MimeType: mimeTypes.join(";")
            };
            let desktop = "[Desktop Entry]";
            for (const [key, value] of Object.entries(metadata))
                desktop += `\n${key}=${value}`;
            desktop += "\n";
            if (!(0, fs_1.existsSync)(makeDir))
                (0, fs_1.mkdirSync)(makeDir, { recursive: true });
            const stageDir = path_1.default.join(makeDir, "__appImage-x64");
            if ((0, fs_1.existsSync)(stageDir))
                (0, fs_1.rmdirSync)(stageDir);
            (0, fs_1.mkdirSync)(stageDir, { recursive: true });
            yield appBuilder.executeAppBuilderAsJson([
                "appimage",
                "--stage", // /home/build/Software/monorepo/packages/electron/out/make/__appImage-x64
                stageDir,
                "--arch", // x64
                "x64",
                "--output", // /home/build/Software/monorepo/packages/electron/out/make/name-2.0.6.AppImage
                appPath,
                "--app", // /home/build/Software/monorepo/packages/electron/out/name-linux-x64
                dir,
                "--configuration",
                JSON.stringify({
                    productName: appName,
                    productFilename: appName,
                    desktopEntry: desktop,
                    executableName: executable,
                    icons: config.icons,
                    fileAssociations: []
                })
            ]);
            return [appPath];
        });
    }
}
exports.default = MakerAppImage;
//# sourceMappingURL=MakerAppimage.js.map