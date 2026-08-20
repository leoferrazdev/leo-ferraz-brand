(function () {
  "use strict";

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");
  }

  function platformName(detail) {
    var source = normalize(
      detail.platform || detail.source || detail.service || detail.provider
    );

    if (source.indexOf("youtube") !== -1) return "youtube";
    if (source.indexOf("twitch") !== -1) return "twitch";
    if (source.indexOf("streamlabs") !== -1) return "streamlabs";
    if (source.indexOf("facebook") !== -1) return "facebook";
    return "other";
  }

  function messageNode(messageId) {
    if (!messageId) return null;

    var nodes = document.querySelectorAll("#log [data-id]");
    var expected = String(messageId);

    for (var index = 0; index < nodes.length; index += 1) {
      if (nodes[index].getAttribute("data-id") === expected) {
        return nodes[index];
      }
    }

    return null;
  }

  document.addEventListener("onEventReceived", function (event) {
    var detail = (event && event.detail) || {};
    var payload = detail.payload || {};
    var node = messageNode(detail.messageId || detail.id || payload.messageId);

    if (!node) return;

    node.dataset.platform = platformName(detail);

    var tags = detail.tags || {};
    var displayName = tags["display-name"] || detail.displayName || detail.name;
    var nameNode = node.querySelector(".name");

    if (nameNode && displayName) {
      nameNode.dataset.name = String(displayName);
    }
  });
})();
