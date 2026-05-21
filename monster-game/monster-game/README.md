# ✨ モンスターライフ

## 公開手順（初回のみ・10分）

### ① Node.js を入れる（まだなら）
https://nodejs.org → LTS版をダウンロードしてインストール

### ② このフォルダをターミナルで開いて実行
```
npm install
```

### ③ ローカルで動作確認（任意）
```
npm run dev
```
→ http://localhost:5173 で確認できる

### ④ GitHubにアップロード
1. https://github.com → 「New repository」
2. リポジトリ名: `monster-life`（なんでもOK）、Public にする
3. 「Create repository」→ 表示されるコマンドをターミナルで実行:
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/monster-life.git
git push -u origin main
```

### ⑤ Vercel に繋ぐ
1. https://vercel.com → 「Sign Up」（GitHubアカウントでログイン）
2. 「Add New Project」→ monster-life を選択
3. そのまま「Deploy」→ 数秒で完成！

→ `https://monster-life-xxxx.vercel.app` のような固定URLが発行される

---

## 更新方法（2回目以降）

src/App.jsx を編集して:
```
git add .
git commit -m "update"
git push
```
これだけで Vercel が自動でビルド＆更新。URLは変わらない。
