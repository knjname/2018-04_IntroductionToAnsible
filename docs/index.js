/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const remark = __webpack_require__(1);

const $s = document.getElementById("source");
$s.textContent = __webpack_require__(2);

remark.macros.scale = function(percentage) {
  var url = this;
  return '<img src="' + url + '" style="width: ' + percentage + '" />';
};

const slideshow = remark.create();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = remark;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "class: center, middle\n\n# 2018/04 Ansible 導入会\n\nby Kenji Saitou\n\n---\n\n# 今日話す内容\n\nサーバの構成管理ツールの Ansible について使い方などを紹介していきます。\n\n---\n\n# 今日ターゲットにする人\n\n* Ansible やったことない人、さわったことない人\n* サーバ構成で忘れ物がある人\n  * 複数台セットアップで抜け漏れマン 😅\n* 自動化大好きマン\n* Linux は普通程度には知ってる。SSH の知識はある。\n\n**特に深く掘り下げず、入り口に立っていくことが目的です。**\n\n---\n\nclass: center, middle\n\n# 我々は何に困っているのか？\n\n---\n\n## サーバの構成という退屈なタスク\n\n* 🐙 「`【本番用】サーバ構築手順書_20180101.docx`どうぞ。」\n* 🐶 「了解。」\n* 🐶 （一つ一つ TeraTerm 繋げて設定するの面倒だな…）\n\n> * 手順 1. SCP で資材をアップロードする。\n> * 手順 2. Teraterm (TTLogMe) で SSH ログインする。\n> * 手順 3. `cd /opt/foobar` をする。\n\n…あ、もういいです。お腹いっぱいです。\n\n---\n\n## 間違えるのは誰のせいか？\n\n1. 🐶 「終わったよ」\n2. 😿 「頼んでたパッケージとか設定が ホスト XXX に無いんだが…」\n\n* → 一人でやっても複数人でやっても起きうる話\n* → 人間が複数ホストをきれいに管理するのは不可能。\n\n---\n\n## 作業ってつまらないし、遅い\n\n* 手順書をそのまま実行できますか？\n  * コマンドのコピペ、そして失敗。何がタイプミス？\n  * 実施した手順にチェックを押していくんですか？あ、今そこ飛ばさなかった？ちゃんとやった？\n  * 手順書がソフトウェアとして動くわけではない。\n* 単純に退屈ではありませんか？\n  * 何回も定期的に同じ手順を繰り返すの苦痛。\n  * ホスト数、何台あると思っている？\n    * AP / Batch / DB\n  * アプリ数、いくつあると思っている？\n  * 環境のバリエーション、いくつあると思っている？\n  * サブシステム、いくつあると思っている？\n\nマトリクスで 30 超える数のデプロイが本番環境だけで必要というプロジェクトも多いのでは？\n\n---\n\n## サーバに個性はいらない\n\n* 無駄な個性は、引き継ぎが大変\n* アドホックに発生していくサーバ変更\n  1. 😸 「あ、 `pstree` が入ってない。入れたろ。」\n  2. 😸 「あ、 `iotop` が入ってない。入れたろ。」\n  3. 😸 「あ、 `XXXX` が入ってない。epel 追加して入れたろ。」\n* 中途半端な作業\n  1. 😸 「`/etc/hosts` に今回新しく追加したホストを追加したろ」\n  2. 😸 「 サーバ A はこれに影響されるけど、サーバ B は、まあ、…ええやろ 」\n\nいつでも減らせる、いつでも増やせる、いつでも作り直せる\n\n---\n\n## 進むべき方向\n\n### ❌\n\n* 🐶 「きちんと指差し確認をして、作業所にチェック印をして、作業漏れがないようにしよう！！」\n* 🐶 「んじゃ、TeraTerm マクロ仕込んだろｗ」\n\n→ 入り口は出口にもなっております。\n\n### 💯\n\n* 🐶 「ホストのあるべき状態をきちんとコードで管理しよう」\n\n→ ようこそ！世界へ！\n\n---\n\nclass: center, middle\n\n# Ansible とは何か？\n\n---\n\n## Ansible 沿革\n\n* 公式サイト: https://www.ansible.com/\n* ソースコード: https://github.com/ansible/ansible\n* 開発: RedHat\n* Since 2012 年 〜\n* 商用サポート版あり\n\n---\n\n## サーバ構成管理ツール\n\n* サーバのあるべき姿を書いた Playbook という YAML を実行することにより、サーバのあるべき姿に導く\n  * あるべき姿: firewalld が動いている\n  * あるべき姿: apache がインストールされて動いている\n  * あるべき姿: chrony がインストールされている\n  * あるべき姿: こちらで管理しているファイルが `/etc/xxx/xxx.conf` に入っている\n* 注意：サーバの知識が要らなくなるわけではない。\n\n---\n\n## もっと簡単にいえば、すごい SSH\n\n* `ssh` でできることはできる。できないことはできない。\n  * 基本的には CLI 操作の自動化しかできない。\n    * GUI / インタラクティブ前提は滅びてください。\n\n---\n\n## [仲間](https://alternativeto.net/software/ansible/)\n\n* Chef\n  * 元祖サーバ構成管理ツールといえばこれ。\n  * ここからサーバ構成管理が流行った感がある。\n* Puppet\n* Salt\n  * 日本じゃあまり知られてない。\n\nこれ以外にも、クラウドプラットフォームごとプロビジョニングをするツールがあったりしますが、深追いはしません。\n\n---\n\n## Ansible の利点\n\n* サーバ側にエージェントが不要 (エージェントレス)\n  * 一番の利点。単純に始めやすい\n  * サーバが SSH で入れて、Python が入っていれば OK。\n  * Windows をマネージしたい場合は、PowerShell / [WinRM](<https://msdn.microsoft.com/ja-jp/library/aa384426(v=vs.85).aspx>) など必要。\n* プログラミング出てこない\n  * ほぼ YAML で記述。要するに JSON や XML の仲間みたいなので記述。\n    * 凝ったことをやろうとすると、設定ファイルでプログラミングするようなイメージになる。\n  * 作り込み方が収束しやすい。反面、自由度はあまりない。\n    * とはいえ、他のプログラミング言語を使うケースでも DSL なので似たらしい結果にはなる。\n  * ノンプログラマーも懐柔しやすいのでは？\n* シンプル\n  * 色々な仕組みはあるものの、最終的には上から下に SSH 上で操作をしていくスタイルに近い。\n\n---\n\nclass: center, middle, large\n\n**一番の利点は<br/>人気があること**\n\n---\n\n## Ansible たぶん 向いている\n\n* 大量のホストを一括管理したい\n  * 特にクラウド環境\n* サーバのセットアップをコードとして文書化したい\n\n---\n\n## Ansible たぶん 向いていない\n\n* やたら凝ったセットアップが必要なサーバには不向き\n  * FB チャネルでネットワークストレージをボリュームに追加して再起動云々みたいな手順は管理できないと思う\n  * クラウドで提供される VM みたいな層以上の自動化にしか使えない\n* すごい特殊な環境には不向き\n* 本番環境がすごいオフライン\n* ログインを自動化できない\n  * いちいちパスワード入力が必要なケース\n\n---\n\n## 利点を活かすのに大事な視点\n\n* サーバはシンプルな方がいい\n* なるべく管理するサーバの特徴（ディストリビューションなど）は均一化されていたほうがいい\n\n現段階では汎用の Linux を自動的に管理するのには向いています。\n\nおそらく Ansible の可能性を引き出せないケースであっても初期セットアップには使えるケースは多いと思います。\n\n```\n難易度\n\n初期インフラセットアップのみ\n  ＜ 継続的なインフラ管理\n  ＜ アプリのリリースごと\n  ＜ CI / CD\n```\n\n---\n\nclass: center, middle\n\n# Ansible をはじめる<br/>（準備編）\n\n---\n\n## Ansible で使用される言語\n\n下記についての知識があると Ansible で不自由しないでしょう。\n\n1. YAML (`*.yml` or `*.yaml`)\n   * 木構造のデータを多少のデータ型を交えながら書く Perl 界隈発祥のデータ記法。\n   * Ansible の構成ファイル、設定値など全てこの形式が使われます。\n   * JSON とほぼ等価だと思えばいいです。 (JSON よりは記述力は上)\n   * [いい入門記事があるので](http://magazine.rubyist.net/?0009-YAML)、これを読めば OK。\n   * Markdown と同じく、処理系で解釈が多少違う。\n2. [Jinja2](http://jinja.pocoo.org/)\n   * Python 用のテンプレートエンジン。 Velocity, ERB, Smarty の仲間みたいなもんです。\n   * YAML の中に `\"{{ variable_name }}\"` のように記述して使うことが多いです。\n   * ループ変数、環境変数、などの記述用\n3. ini ファイル\n   * Windows とかで使われているやつと大差ない。まあ、雰囲気でわかる。\n\n---\n\n## かんたん YAML マスター\n\n### リテラル\n\n```yaml\nstring # 文字列\n\"string\" # '文字列' でも可\nnull # NULL\n123,456,789 # 数値。小数も可能。\ntrue # 真偽値: true(on) / false(off)\n2018-04-20 # 日付\n```\n\n```yaml\n|\n  複数行の\n  文字列も\n  書ける（各行の先頭インデントは必要だが、全てトリムされる）\n```\n\n---\n\n## かんたん YAML マスター\n\n### リスト\n\n```yaml\n# ブロックスタイル\n- listItem01\n- listItem02\n---\n# フロースタイル\n[listItem01, listItem02]\n```\n\n### マップ\n\n```yaml\n# ブロックスタイル\nmapKey1: mapValue1\nmapKey2: mapValue2\n---\n# フロースタイル\n{ mapKey1: mapValue1, mapKey2: mapValue2 }\n```\n\n---\n\n## かんたん YAML マスター\n\n### リストとマップの複合\n\n```yaml\n- mapKey1: mapValue1\n  mapKey2: mapValue2\n- {mapKey1: mapValue1, mapKey2: mapValue2}\n```\n\n```yaml\nservices:\n  nginx:\n    image: \"nginx\"\n```\n\n---\n\n## かんたん YAML マスター\n\n### ドキュメント\n\nドキュメント ＝ 1 つの YAML ツリーデータ。XML でいえば、ルート要素にあたる。\n\nYAML ではこれを `---` で区切ることにより複数持つことができる。\n\n```yaml\n# 以下は3ドキュメント構成。 --- が区切り。\n---\n- list1\n- list2\n---\n\"私は元気です\"\n---\nmapKey1: mapValue2\n```\n\n---\n\n## かんたん YAML マスター\n\n### エイリアス定義＆参照\n\n```yaml\n- &foobar \"さくらんぼー！\"\n- \"ひ、ひぎぃー！\"\n- *foobar\n\n# => [\"さくらんぼー！\", \"ひ、ひぎぃー！\", \"さくらんぼー！\"]\n```\n\n---\n\n### YAML の特徴的なところ\n\n* XML/JSON とは違い、１ファイルに複数のドキュメント（≒ 木構造のルート）を含めることができます。\n  * ドキュメントそのものはマップ・リスト・リテラルどれでもよい\n  * ただ Ansible の範囲では、複数のドキュメントとかは使わない。\n* 見やすい\n  * XML よりも。\n    * 余談だけれども、XML はツリー構造じゃなくて一部を `<a>リンク</a>` にしたりする記法が特別に得意。周辺技術も揃っているのもいい。\n* 書きやすい\n  * JSON なんかはコメントが入れられないのがキツイ。\n* 表現力がある\n  * いろいろな機能があるらしいですが、把握している人、いる？\n\n---\n\n### YAML を知っておくといいこと\n\n* 割りと色々な場面で使われていて知識として潰しは効く\n  * docker-compose / SpringBoot / CloudFormation / Google Cloud Deployment Manager\n* 普及率\n  * あの日輝いていた XML は死んだ\n  * JSON も人が手書きするフォーマットとしては死につつある （私の偏見）\n* 最近人気の競合フォーマットとして [TOML](https://github.com/toml-lang/toml) がある\n  * ini っぽいやつ\n\nAnsible を使う上では、結局 Ansible が YAML を読んで何を解釈しているか理解できていたほうがスムーズ。（Ansible がどこを高度に解釈して応用しているかわかる）\n\n---\n\n### [Jinja2](http://jinja.pocoo.org/docs/2.10/templates/)\n\n```yaml\n\"{% ... %}\" # ステートメント\n\"{{ ... }}\" # 式\n\"{# ... #}\" # コメント\n```\n\n* いろいろあるけど、だいたい YAML 中や設定のテンプレートファイル中で `{{ variable_name }}` みたいなのしか使わない。\n  * `{{ ... }}` という記法がモロに YAML とぶつかるので、Ansible では常に `\"{{ ... }}\"` のように明示的に文字列リテラルの中に書く。\n* 僕もあんまり詳しくないけど凝ったことやろうとすると、知る必要が出て来るイメージ。\n\n---\n\n## Ansible のインストール\n\n* Windows はサポートされていない\n* [macOS / Linux / 一部の UNIX](http://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)\n\nプラットフォーム独立なインストール方法としては、Python の pip でインストールできます。\n\n```console\n$ sudo pip install ansible\n```\n\n---\n\nclass: center, middle\n\n# Ansible をはじめる<br />シンプルスタート編\n\n---\n\n## シンプルスタート\n\nかなり前置きが長くなってしまいましたが、まずはシンプルに Ansible を使い始めてみましょう。\n\n---\n\n## マシン準備\n\n遊び相手として CentOS \\* 2 を Vagrant(VirtualBox)で用意します。\n\n```console\n$ cd examples/simple_start\n$ vagrant up\n```\n\n上記コマンドで、下記サーバが立ち上がり、 `vagrant` というユーザで公開鍵認証によりログインできるようになります。\n\n1. `webserver`: `192.168.50.2`\n2. `dbserver`: `192.168.50.3`\n\n---\n\n## 単純に単発のモジュールを実行させてみる\n\n下記のファイルの設定を確認しましょう。\n\n```\nhosts ansible.cfg\n```\n\nコマンドを流してみましょう。\n\n```console\n# 応答チェック (pingモジュール)\n$ ansible -m ping web_server\n\n# コマンドの実行 (commandモジュール)\n$ ansible -m command -a \"whoami\" web_server\n\n# rootに昇格して実行\n$ ansible -m command -b -a \"whoami\" web_server\n\n# yum で何か入れてみる (yumモジュール)\n$ ansible -m yum -b -a \"name=uuid state=present\" web_server\n$ ansible -m command -a \"uuid\" web_server\n```\n\n---\n\n## サーバの構成管理をしてみる\n\n`playbook.yml` など を確認しましょう。\n\n```yaml\n---\n\n# 構成はプレイブックというYAMLファイルに記述していく。\n- hosts: all\n  become: true\n  tasks:\n    # Fiwewalld を有効化\n    - name: enable firewalld\n      systemd:\n        name: firewalld\n        enabled: yes\n        state: started\n```\n\n---\n\n## サーバの構成管理をしてみる\n\nプレイブックを流すコマンドを流してみましょう。\n\n```console\n$ ansible-playbook playbook.yml\n# もう1回!\n$ ansible-playbook playbook.yml\n```\n\nWeb ページが立ち上がっているはずです。\n\nhttp://192.168.50.2/my_php_app/\n\n---\n\n## シンプル編 まとめ\n\n* Ansible で扱うエンティティ\n  * [モジュール](http://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)  \n    e.g. `yum` とか\n  * インベントリ = `hosts`  \n    物理的なサーバホストの記述とグルーピングやらはここに書く\n  * プレイブック = `playbook.yml`\n* Ansible 実行をスムーズにするためには...\n  * Ansible 用ユーザを用意しておく\n  * 公開鍵で入れるようにしておく\n  * sudo で昇格できるようにしておく\n\n---\n\nclass: center, middle\n\n# Ansible をはじめる<br />（やや複雑編）\n\n---\n\n## 🐸 やや複雑編\n\nもう少し多いサーバ群を構成してみます。\n\n* ステージング (stg)\n  * Web \\* 1\n  * DB \\* 1\n* 本番 (prd)\n  * Web \\* 4\n  * DB \\* 2\n\n立ち上げは前回と同様に行います。 （8 台なので時間がかかります）\n\n```console\n$ cd examples/complicated_start\n$ vagrant up\n```\n\n---\n\n## 🐸 大合唱\n\n複数台のマシンで一気にモジュールを実行してみましょう。\n\n```console\n# ステージング 2台 に一気に実行\n$ ansible -i inventories/staging/hosts -m ping all\n\n# 本番 6台 に一気に実行\n$ ansible -i inventories/production/hosts -m ping all\n```\n\n---\n\n## 🐸 環境ごとのプレイブック反映\n\n環境ごとにプレイブックを反映させていきましょう。\n\n（通常は結合 → ステージング → 本番の順に構成の適用が問題ないか試験しつつスライドすることになります。）\n\n```console\n# ステージング 2台\n$ ansible-playbook -i inventories/staging/hosts site.yml\n\n# 本番 6台 に一気に実行\n$ ansible-playbook -i inventories/production/hosts site.yml\n```\n\n---\n\nclass: center, middle\n\n# 私と Ansible\n\n---\n\n## 実際に案件に Ansible 放り込んでます (2018/01〜)\n\n* 基本的にアプリは Docker + docker-compose で構成。\n  * DB などミドルウェア含めてほぼ全て Docker で動く。\n  * 全サーバで Docker / docker-compose を使えるように構成。\n  * トラブルシューティング、性能監視系、バックアップ系で必要なツールやパッケージも全サーバにインストール。\n* よくある (?) フロント + API サーバ + DB サーバ + バッチ + α みたいな構成\n  * それぞれの単位で `/opt/foobar/<コンポーネント名>` というパスのディレクトリの下に資材やデータを置いて管理している\n    * Ansible でそれぞれロールごとに独立してインストールできるようにルールを作った\n* どういう構成になっているのかドキュメントがわりになる。\n\n---\n\n## 開発環境サーバも Ansible で構成しています\n\n* GCP で VM たててその上に前述と同じような形で Ansible セットアップ。\n* 下記のサービスを構築してある。\n  * LDAP\n  * Jenkins\n  * Gitlab\n  * Subversion\n  * Rocket.Chat\n  * Redmine\n  * Nexus\n* 全部 Let's encrypt で取得した証明書で HTTPS(HTTP2.0)でセキュアにアクセス可能\n* 他案件にも流用可能かな\n\n---\n\n## 出会い始めのころの思い出\n\n* 適当にプレイブックを作って管理がつらくなって爆死した\n  * ベストプラクティスに沿えば大丈夫\n    * ただディレクトリはたくさんできる\n    * YAML もよう増える 仕方なし\n    * 値系は別 YAML に隔離するとよい\n\n---\n\nclass: center, middle\n\n# さいごに\n\n---\n\n## まとめ\n\n* Ansible はシンプルでわかりやすい\n* エージェントレスなので始める際の障壁が少ない\n* 身近なところから始めたらどうだろうか？\n  * 開発環境\n  * 本番サーバの初期セットアップ\n\n---\n\n## 学びたい人向けへの資源\n\n[Ansible 実践ガイド](https://www.amazon.co.jp/dp/B01NAH7NAA/)\n\n普通に知りたいことは網羅されている。これさえあれば大丈夫。\n\n---\n\n## 資料はこちら\n\n* ソースコード  \n  https://github.com/knjname/2018-03_IntroductionToAnsible\n* スライド  \n  https://knjname.github.io/2018-03_IntroductionToAnsible/\n\n---\n\n## Q and A\n\n### Q. XXX\n\nA. XXX\n\n---\n\nclass: center, middle\n\nおわり\n"

/***/ })
/******/ ]);