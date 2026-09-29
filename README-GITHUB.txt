ساختار پیشنهادی مخزن GitHub (همه فایل‌ها در ریشه یک repo):

SRJ_Management_Dashboard.V3.0.0.html
SRJ_Personnel_App3.0.html
manifest-admin.json
manifest.json
sw.js
icon-192.png
icon-512.png
apple-touch-icon.png
favicon-32.png
favicon.png
data/db.json

نکته:
- اپ پرسنل از manifest.json استفاده می‌کند.
- پنل مدیریت از manifest-admin.json استفاده می‌کند.
- هر دو اپ از sw.js مشترک استفاده می‌کنند.
- data/db.json را حذف یا جایگزین نکنید.
- اگر HTMLها را به پوشه‌های جدا منتقل کردید، مسیرهای manifest، sw.js و آیکون‌ها را باید مطابق همان پوشه اصلاح کنید.
