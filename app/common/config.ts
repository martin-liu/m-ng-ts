// __CONFIG_FILE__ will be replaced to real config file by webpack plugin
import {config} from "__CONFIG_FILE__";
import {routes} from "../config/routes.ts";
import {intros} from "../config/intro.ts";
import {Constant} from "../config/constant.ts";

let Config:any = config;
Config.routes = routes;
Config.intros = intros;

export {Config, Constant};
