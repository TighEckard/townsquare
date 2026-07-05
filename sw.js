self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function(){});

self.addEventListener("push", function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e){}
  var title = data.title || "Town Square";
  var options = {
    body: data.body || "",
    tag: data.tag || undefined,
    data: { itemId: data.itemId || null },
    actions: data.actions || [],
    icon: "./icon.svg",
    badge: "./icon.svg",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event){
  event.notification.close();
  var itemId = event.notification.data && event.notification.data.itemId;
  var target = "./index.html";
  if (event.action === "approve" && itemId) target = "./index.html?approve=" + itemId;
  else if (event.action === "cancel" && itemId) target = "./index.html?cancel=" + itemId;
  else if (itemId) target = "./index.html?item=" + itemId;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        var c = list[i];
        if ("focus" in c){
          if ("navigate" in c) { try { c.navigate(target); } catch(e){} }
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
