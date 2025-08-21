---
title: "Chỉ số DP Bitmask cho VRP"
date: "2025-08-20"
tags: ["DP","VRP"]
summary: "Tóm tắt state, chuyển trạng thái, mẹo tối ưu."
cover: assets/images/post1.jpg
---

## Ý tưởng

VRP có thể mã hoá bằng bitmask cho tập khách hàng...

```cpp
// ví dụ code
int dp[1<<N][N];

Thêm 1 dòng vào `posts/_index.json` tương ứng (như mẫu ở trên), commit + push.  
→ Trang chủ sẽ tự thấy bài mới trong grid; click sẽ mở `post.html?file=...` và render Markdown với highlight code, TOC.

---

## Quy trình mỗi lần viết bài
1. Tạo `posts/YYYY-MM-DD-slug.md` với **front-matter** ở đầu.
2. Thêm một object vào `posts/_index.json`.
3. `git add . && git commit -m "post: slug" && git push`.
4. Mở `…/posts/post.html?file=posts/YYYY-MM-DD-slug.md` (hoặc đặt link từ index).

Nếu muốn **đỡ sửa _index.json thủ công**, mình có thể thêm một script nhỏ (chạy trong browser khi mở trang admin) để tự quét danh sách bài dựa theo một file sitemap đơn giản—nhưng với GitHub Pages (web tĩnh) cách tin cậy nhất vẫn là cập nhật `_index.json`.

Cần mình tạo sẵn 1 bài mẫu và PR vào repo của bạn không?
::contentReference[oaicite:0]{index=0}
