class Console {
  public static DEBUG:boolean = false;

  /**
   * @function Atomic.debug
   * @param {string} message
   */
  static debug(message:string):void {
    if (Console.DEBUG) {
      Atomic.print(message);
    }
  }
}

export default Console;
