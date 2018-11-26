
// TS 2.9 can do it by default (don't need this declaration). Remove it when we 
declare module "*.json" {
    const value: any;
    export default value;
}