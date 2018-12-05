/* Load Average Indicator
 *
 * gnome-shell extension that indicates load average in status area.
 * Mainly based on the uptime extension from Gniourf :
 *    https://github.com/Gniourf/Uptime-Indicator
 * 
 * In fact I only changed tiny bits. All credits to Gniourf.
 *
 * Author: Spliff, Spliff.Splendor@gmail.com
 * Date: 2018-12-06
 *
 * Changes:
 *    2018-12-06  initial commit
 */

const PanelMenu=imports.ui.panelMenu;
const St=imports.gi.St;
const Main=imports.ui.main;
const Shell=imports.gi.Shell;
const Mainloop=imports.mainloop;
const Lang=imports.lang;
const PopupMenu=imports.ui.popupMenu;
const Clutter=imports.gi.Clutter;

let _loadavg_indicator_object=null;

const LoadavgIndicator=new Lang.Class(
{
   Name: 'LoadavgIndicator.LoadavgIndicator',
   Extends: PanelMenu.Button,
   buttonText: null,
   _timeout: null,
   _refresh_rate: 3,
   _change_timeout_loop: false,
   _started: null,

   _init: function()
   {
      this.parent(0.0,"Loadavg Indicator",false);

      this.buttonText=new St.Label({
         name: "loadavg-indicator-buttonText",
         y_align: Clutter.ActorAlign.CENTER
      });
      this.actor.add_actor(this.buttonText);

      /* Find starting date and */
      let timestamp=this._get_loadavg();
      let date=new Date();
      this._started=date.toLocaleString();
      /* and prepare menu */
      this._mymenutitle=new PopupMenu.PopupMenuItem(this._started, { reactive: false });
      this.menu.addMenuItem(this._mymenutitle);

      this.actor.connect('button-press-event', Lang.bind(this, this._refresh));
      this.actor.connect('key-press-event', Lang.bind(this, this._refresh));

      this._set_refresh_rate(this._refresh_rate);
      this._change_timeoutloop=true;
      this._timeout=null;
      this._refresh();
   },

   _get_loadavg: function()
   {
      parts =  Shell.get_file_contents_utf8_sync('/proc/loadavg').split(" ");
      return parts[0] + " " + parts[1] + " " + parts[2] ;
   },

   _refresh: function()
   {
      let text=this._update_loadavg();
      this.buttonText.set_text(text)
      if(this._change_timeoutloop) {
         this._remove_timeout();
         this._timeout=Mainloop.timeout_add_seconds(this._refresh_rate,Lang.bind(this, this._refresh));
         this._change_timeoutloop=false;
         return false;
      }
      return true;
   },

   _set_refresh_rate: function(refresh_rate)
   {
      if(this._refresh_rate!=refresh_rate) {
         this._refresh_rate=refresh_rate;
         this._change_timeoutloop=true;
      }
   },

   _remove_timeout: function()
   {
      if(this._timeout) {
         Mainloop.source_remove(this._timeout);
         this._timeout=null;
      }
   },

   _update_loadavg: function()
   {
      return this._get_loadavg();
   },

   destroy: function()
   {
      this._remove_timeout();
      this.parent();
   }
});

// Init function
function init(metadata)
{
}

// Enable function
function enable()
{
   _loadavg_indicator_object=new LoadavgIndicator;
   if(_loadavg_indicator_object) {
      Main.panel.addToStatusArea('loadavg-indicator',_loadavg_indicator_object);
   }
}

// Disable function
function disable()
{
   if(_loadavg_indicator_object) {
      _loadavg_indicator_object.destroy();
      _loadavg_indicator_object=null;
   }
}

