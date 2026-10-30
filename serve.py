"""Local preview server that tells the browser not to cache, so edits show up on every reload.

usage: python serve.py [port]    (default 5173, then open http://localhost:5173)
"""
import functools
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    handler = functools.partial(NoCacheHandler, directory='.')
    with http.server.ThreadingHTTPServer(('127.0.0.1', port), handler) as httpd:
        print('Serving on http://localhost:%d (no caching)' % port)
        httpd.serve_forever()
