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

module.exports = "class: center, middle\n\n# 2018/03 Ansible 導入会\n\nby Kenji Saitou\n\n---\n\n# 今日話す内容\n\nサーバの構成管理ツールの Ansible について使い方などを紹介していきます。\n\n---\n\n# 今日ターゲットにする人\n\n* Ansible やったことない人、さわったことない人\n* サーバ構成で忘れ物がある人\n  * 複数台セットアップで抜け漏れマン 😅\n* 自動化大好きマン\n\n---\n\nclass: center, middle\n\n# 我々は何に困っているのか？\n\n---\n\n## サーバの構成という退屈なタスク\n\n1. 😸 「これで構築お願いします」<br>つ `【本番用】サーバ構築手順書_20180101.docx`\n2. 🐶 「了解。」\n3. 🐶 （一つ一つ TeraTerm 繋げて設定するの面倒だな…）\n\n* → そりゃまあそうでしょう\n\n---\n\n## 間違えるのは誰のせいか？\n\n1. 🐶 「終わったよ」\n2. 😿 「頼んでたパッケージとか設定が ホスト XXX に無いんだが…」\n\n* → 一人でやっても複数人でやっても起きうる話\n* → 人間が複数ホストをきれいに管理するのは不可能。\n\n---\n\n## アドホックに発生していくサーバ変更\n\n1. 😸 「あ、 `pstree` が入ってない。入れたろ。」\n2. 😸 「あ、 `iotop` が入ってない。入れたろ。」\n3. 😸 「あ、 `XXXX` が入ってない。epel 追加して入れたろ。」\n\n* → どこのホストに何が入っているかもうわかりません\n\n1. 😸 「`/etc/hosts` に今回新しく追加したホストを追加したろ」\n2. 😸 「 サーバ A はこれに影響されるけど、サーバ B は、まあ、…ええやろ 」\n\n* → 管理とは一体…\n\n---\n\n## 進むべき方向\n\n### ❌\n\n* 🐶 「きちんと指差し確認をして、作業所にチェック印をして、作業漏れがないようにしよう！！」\n* 🐶 「んじゃ、TeraTerm マクロ仕込んだろｗ」\n\n→ 入り口は出口にもなっております。\n\n### 💯\n\n* 🐶 「ホストのあるべき状態をきちんとコードで管理しよう」\n\n→ ようこそ！世界へ！\n\n---\n\nclass: center, middle\n\n# Ansible とは何か？\n\n---\n\n## 沿革\n\n* 公式サイト: https://www.ansible.com/\n* ソースコード: https://github.com/ansible/ansible\n* 開発: RedHat\n* Since 2012 年 〜\n* エディション\n  * [Ansible Engine](https://www.ansible.com/products/engine/pricing)<br>Ansible の有償サポート＋追加機能版。ありていに言えば Pro 版。\n  * [Ansible Tower](https://www.ansible.com/products/tower)<br>Ansible の中央管理サーバ（GUI 付き） 。\n* 類似プロダクト\n  * [Puppet](https://puppet.com/)\n  * [Chef](https://www.chef.io/chef/)\n\n---\n\n## 簡単にいえば、すごい SSH\n\n* サーバのあるべき姿を書いた Playbook という YAML を実行することにより、サーバのあるべき姿に導く\n  * あるべき姿: firewalld が動いている\n  * あるべき姿: apache がインストールされて動いている\n  * あるべき姿: chrony がインストールされている\n  * あるべき姿: こちらで管理しているファイルが `/etc/xxx/xxx.conf` に入っている\n\n---\n\n## アーキテクチャ\n\n## どう動くのか？\n\n(TODO: 図)\n\n---\n\n## アーキテクチャ\n\n### 簡単にいえば、 SSH + Python\n\n* ものすごく簡単に言うと、すごい SSH\n  * SSH でできないことはできない\n* Chef のようにエージェントのインストールは不要\n  * これは良い\n* リモートが下記を満たしていれば管理可能。\n  * Linux (or Windows)\n  * SSH ログインできる\n  * Python がインストールされている → 普通はインストールされてる\n\n---\n\n## 向き・不向き\n\n* 向いている\n  * 大量のホストを一括管理したい\n    * 特にクラウド環境\n  * サーバのセットアップをコードとして文書化したい\n* 向いていない\n  * やたら凝ったセットアップが必要なサーバには不向き\n    * FB チャネルでネットワークストレージをボリュームに追加して再起動云々みたいな手順は管理できないと思う\n  * すごい特殊な環境には不向き\n  * ログインを自動化できない\n    * いちいちパスワード入力が必要なケース\n\n現段階では汎用の Linux を自動的に管理するのには向いています。\n\n---\n\nclass: center, middle\n\n# Ansible とは何か？\n\n---\n\n## かんたん YAML マスター\n\n---\n\n## インストール\n\n---\n\n## 学びたい人向けへの資源\n\n私は Web と経験で学びました…が、\n\n* 本\n  * [Jenkins 実践入門](https://www.amazon.co.jp/dp/4774189286/)\n    * 読んだことないですが、新しい版も出てるし定番っぽい\n  * [継続的デリバリー](https://www.amazon.co.jp/dp/4048707876/)\n    * デプロイの自動化とは何か？美徳は何か？を教えてくれる\n    * 個人的におすすめ\n* [Jenkins の資格もあるよ](https://www.cloudbees.com/jenkins/jenkins-certification)\n\n---\n\nclass: center, middle\n\n# 私の体験談\n\n---\n\n## 本番環境構築\n\n---\n\nclass: center, middle\n\n# さいごに\n\n---\n\n## 資料はこちら\n\n* https://github.com/knjname/2017-07_IntroductionToJenkins\n* https://knjname.github.io/2017-07_IntroductionToJenkins/\n\n---\n\n## Q and A\n\n### Q. XXX\n\nA. XXX\n\n---\n\nclass: center, middle\n\nおわり\n"

/***/ })
/******/ ]);