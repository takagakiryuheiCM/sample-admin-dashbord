# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code (claude.ai/code)向けのガイダンスを提供します。

## プロジェクト概要

これは、React、TypeScript、Vite で構築されたイオンモール向けの管理ダッシュボードアプリケーションです。インターフェースは主に日本語で、メンバー/管理者管理に焦点を当てています。

## コマンド

### 開発

- `npm run dev` - 開発サーバーを起動（デフォルトでポート 5173 で実行）
- `npm run build` - TypeScript で型チェックを行い、本番用にビルド
- `npm run lint` - ESLint を実行してコード品質をチェック
- `npm run preview` - 本番ビルドをローカルでプレビュー
- `npm run format` - Prettier でコードを自動整形
- `npm run format:check` - Prettier でコードの整形状態をチェック

### テスト

現在、テストフレームワークは設定されていません。テストを追加する際は、Vitest や Jest などのテストフレームワークをインストールする必要があります。

## アーキテクチャ

### 技術スタック

- **React 19.1.1** と TypeScript 5.8.3
- **Vite 7.1.7** - 高速な開発と最適化されたビルド
- **Tailwind CSS v4** （CSS-in-JS アプローチを採用した最新バージョン）
- **SWR 2.3.6** - サスペンスモードでのデータフェッチング
- **React Router DOM 7.9.2** - クライアントサイドルーティング
- **shadcn/ui コンポーネント** - Radix UI プリミティブ上に構築

### プロジェクト構造

```
src/
├── components/          # 共有UIコンポーネント
│   ├── ui/             # shadcn/uiコンポーネントライブラリ
│   └── [AppSidebar, DataTable, Loading, PageHeader, SearchFilter]
├── features/           # 機能ベースのモジュール
│   └── members/        # メンバー管理機能
│       ├── hooks/      # カスタムフック
│       |   ├── useMembersQuery.ts # メンバー取得用のカスタムフック
│       |   └── useOrganizationsQuery.ts # 組織取得用のカスタムフック
│       |   └── index.ts # メンバー管理機能のエントリーポイント(useMembersQuery, useOrganizationsQuery)
│       ├── MemberListPage.tsx # メンバー管理機能のメインページ
│       └── sample-data/# 開発用のサンプルデータ（APIとの繋ぎ込み前に一旦返却するサンプルのデータ）
├── lib/               # ユーティリティ (cn()関数用のutils.ts)
├── routes/            # ルート設定
└── App.tsx            # SWRConfigとルーティングを含むメインアプリ
```

### 主要なパターン

1. **機能ベースアーキテクチャ**: コードはファイルタイプではなく、機能別に整理（例：`/features/members/`）
2. **データ取得用カスタムフック**: すべての API 呼び出しは SWR を使用したカスタムフックに抽象化
3. **型安全性**: strict モードでの完全な TypeScript 実装
4. **コンポーネントバリアント**: コンポーネントスタイリングバリアントに CVA（class-variance-authority）を使用
5. **パスエイリアス**: `@/*`は`src/*`にマッピングされ、よりクリーンなインポートを実現

### データフェッチングパターン

```typescript
// すべてのデータフェッチングはカスタムフックでSWRを使用
const { data: members } = useMembersQuery()
const { data: organizations } = useOrganizationsQuery()
```

### 現在の機能

- **メンバー管理** (`/members`): メンバーデータの一覧表示、フィルタリング、CSV エクスポート機能
- **ホームページ** (`/`): ナビゲーション付きのランディングページ

### 重要な設定

- SWR は App.tsx で`suspense: true`で設定されている
- エラーハンドリングや、ローディングは App.tsx で全てキャッチするようにしている
- Tailwind CSS は最新のカラー管理のため OKLCH カラースペースを使用
- TypeScript は strict モードとモダンな ES2022 ターゲットで設定

## [重要]開発する際に必ず実施すること

- 既存のコードを確認し、アーキテクチャや実装パターンを把握、参考にしてコードを生成します。
- コンポーネントの実装は、src/features/members/MemberListPage.tsx を参考にしてコードを生成します。
- src/features/members/hooks/useMembersQuery.ts などのカスタムフックを参考にしてコードを生成します。
- 必要なコンポーネントがあれば、shadcn/ui から install します
