import Console from "./../../Atomic/Console";

const PREFS_FILE:string = 'SpaceGameMultiPlayer.json';

class LocalStorage {
  private debug:Function = Console.debug;
  private filesystem:Atomic.FileSystem = Atomic.getFileSystem();
  private documentsDir:string = null;
  private prefFilePath:string = null;

  constructor() {
    this.documentsDir = this.filesystem.getUserDocumentsDir();
    this.prefFilePath = this.documentsDir + PREFS_FILE;
  }

  /**
   * @function LocalStorage#getJSONPrefData
   * @private
   * @returns {any}
   */
  private getJSONPrefData():any {
    if (!this.filesystem.fileExists(this.prefFilePath)) {
      return {};
    }

    let file:Atomic.File = new Atomic.File(this.prefFilePath, Atomic.FILE_READ);

    // Read the data string and parse the JSON back to an object
    return JSON.parse(file.readText());
  }

  /**
   * @function LocalStorage#setServerName
   * @param {string} serverName
   */
  setServerName(serverName:string):void {
    let data = this.getJSONPrefData();
    data.serverName = serverName;

    let file = new Atomic.File(this.prefFilePath, Atomic.FILE_WRITE);

    // Convert the data object to a string and write it
    file.writeString(JSON.stringify(data));

    // close the file
    file.close();
  }

  /**
   * @function LocalStorage#getServerName
   * @returns {string}
   */
  getServerName():string {
    let data = this.getJSONPrefData();
    return (data.serverName) ? data.serverName : 'Server';
  }

  /**
   * @function LocalStorage#setPlayerName
   * @param {string} playerName
   */
  setPlayerName(playerName:string):void {
    let data = this.getJSONPrefData();

    data.playerName = playerName;

    var file = new Atomic.File(this.prefFilePath, Atomic.FILE_WRITE);

    // Convert the data object to a string and write it
    file.writeString(JSON.stringify(data));

    // close the file
    file.close();
  }

  /**
   * @function LocalStorage#getPlayerName
   * @returns {string}
   */
  getPlayerName():string {
    let data = this.getJSONPrefData();
    return (data.playerName) ? data.playerName : 'Player';
  }
}

export default LocalStorage;

