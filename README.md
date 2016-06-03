# Sections

- [Intro](Intro)
- [Components](Components)
- [Modules](Modules)

## Intro

The files in the `Resources` directory (JavaScript, *.js, *.js.map) are the generated/compiled files from TypeScript, located in `src/Resources`. These are included for people that maybe just want to see an example without having to compile TypeScript.

## Components

Components are located and loaded from the `Resources/Components` directory. Like modules, it is a good idea to organize these with sub-directories.

Components can be used in the Atomic Editor by attaching a Component to a node via `Create Component` => `Logic` => `JSComponent`.

Components can also expose fields to the editor's inspector by defining a `inspectorFields` object on the component object.

It is also important to note the requirement of adding `'atomic component';` to the top of the JS file.

Notice we export this component slightly different, using `export = Enemy` instead of `export default Enemy`. This is because Atomic requires a `component` property on `exports`.

```typescript
class Enemy extends Atomic.JSComponent {
  inspectorFields = {
    health: [Atomic.VAR_INT, 0],
    armor: [Atomic.VAR_INT, 0]
  };
  health:number = 0;
  armor:number = 0;

  /**
   * @function Enemy#start
   * @inheritDoc
   * @override
   */
  start():void {
    Atomic.print('Enemy.health=' + this.health);
  }

  /**
   * @function Enemy#update
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    if (this.health <= 0) {
      this.die();
    }
  }

  /**
   * @function Enemy#die
   */
  die():void {
    // logic to die
  }
}

export = Enemy;
````

## Modules

Modules are loaded out of the `Resources/Modules` directory. It can be a good idea to break this up by sub-modules just like you would organize Java/other code.

### TypeScript import/export

```typescript
import Test from './Test';

class Foo {
  test:Test;

  /**
   * @function Foo#bar
   * @returns {Test}
   */
  bar():Test {
    return test;
  }
}

export default Foo;
```
