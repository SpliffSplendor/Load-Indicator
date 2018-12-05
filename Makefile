destdir=$(HOME)/.local/share/gnome-shell/extensions/loadavg-indicator@spliff.splendor.gmail.com
filestoinstall=AUTHORS COPYING extension.js metadata.json stylesheet.css

all:
	@echo "make options:"
	@echo "      install"
	@echo "      uninstall"
	@echo "      dist-zip"
	@echo "      clean"

install:
	@install -Cdv "$(destdir)"
	@install -Cv -m 644 $(filestoinstall) "$(destdir)"

uninstall:
	@-rm -rfv "$(destdir)"

dist-zip:
	@zip -jv uptime-indicator $(filestoinstall)

clean:
	@-rm -fv uptime-indicator.zip

