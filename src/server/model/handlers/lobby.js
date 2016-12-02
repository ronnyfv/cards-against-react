import * as A from "../../actions";
import { HandlerBase } from "../../lib/handlers";
import { validateMessage } from "../../shared/validation/chat";

export default class LobbyHandlers extends HandlerBase {
  constructor(client, lobby) {
    super(client);

    this.lobby = lobby;

    this.onDispose(
      lobby.addClient(client),
      client.onRequest(A.LOBBY_SEND_MESSAGE, (action) => {
        const validator = validateMessage(action.message);

        if (validator.didFail) {
          client.fail(action, validator.message);
          return;
        }

        console.log(this.client);
        lobby.sendMessage(this.client, action.message);
      })
    );

    if (client.isLoggedIn)
      this.onLogin();
  }

  onLogin() {
    this.user = this.lobby.addUser(this.client.id, this.client.name);
    this.onDispose(this.user.addClient(this.client), () => this.user.dispose());
  }
}