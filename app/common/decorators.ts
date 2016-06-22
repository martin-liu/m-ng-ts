export function Inject(...dependencies:Array<string>) {
  return function decorator(target, key, descriptor) {
    if(descriptor) {
      const fn = descriptor.value;
      fn.$inject = dependencies;
    } else {
      target.$inject = dependencies;
    }
  };
};
