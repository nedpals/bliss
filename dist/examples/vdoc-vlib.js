"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path_1 = require("path");
const which_1 = __importDefault(require("which"));
const bliss_1 = require("../bliss");
const vdoc_1 = __importDefault(require("./vdoc"));
which_1.default('v')
    .then(vroot => {
    return path_1.join(path_1.dirname(vroot), 'vlib');
})
    .then(vlib_path => {
    console.log(glob_1.sync(vlib_path + '\\*'));
    return Promise.all(glob_1.sync(vlib_path + '\\**\\*').map(mod => {
        return bliss_1.Importer.resolveModuleFilepaths(path_1.basename(mod));
    }));
})
    .then(modfiles => {
    const files = modfiles.map(mod => mod[0]).filter(Boolean);
    console.log(files);
    return Promise.all(files.map(f => vdoc_1.default(f)));
})
    .then(() => {
    console.log('Success.');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmRvYy12bGliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4YW1wbGVzL3Zkb2MtdmxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUF5QztBQUN6QywrQkFBNEQ7QUFDNUQsa0RBQTBCO0FBQzFCLG9DQUFvQztBQUNwQyxrREFBMEI7QUFFMUIsZUFBSyxDQUFDLEdBQUcsQ0FBQztLQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNWLE9BQU8sV0FBUyxDQUFDLGNBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUM7S0FDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFFZCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUxQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUQsT0FBTyxnQkFBUSxDQUFDLHNCQUFzQixDQUFDLGVBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDLENBQUM7S0FDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDYixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFbkIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQztLQUNELElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDIn0=