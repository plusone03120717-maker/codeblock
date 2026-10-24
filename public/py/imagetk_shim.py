"""PIL.ImageTk の代わり：PIL の画像を、アプリの窓に出せる形（data URL）にする。"""
import base64
import io


class PhotoImage:
    def __init__(self, image=None, size=None, **kw):
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        self._data_url = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
        self._w, self._h = image.size

    def width(self):
        return self._w

    def height(self):
        return self._h


BitmapImage = PhotoImage
