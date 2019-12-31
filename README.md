# headless-eval

> CLI tool to evaluate a JS snippet in a webpage context with headless chrome

[![pipeline status](https://gitlab.com/vith/headless-eval/badges/master/pipeline.svg)](https://gitlab.com/vith/headless-eval/pipelines)
[![dependency status](https://david-dm.org/vith/headless-eval.svg)](https://david-dm.org/vith/headless-eval)

## Install

```console
$ npm i -g headless-eval
```


## Usage

```console
$ headless-eval -h
Usage: headless-eval [options] <url> <js_snippet>

CLI tool to evaluate a JS snippet in a webpage context with headless chrome

Options:
  -V, --version  output the version number
  -j, --json     output result as JSON
  -h, --help     output usage information
```

## Examples

```console
$ headless-eval https://news.ycombinator.com '[...document.querySelectorAll("a.storylink")].slice(0, 3).map(a => `${a.textContent} - ${a.href}`)'
Apple News No Longer Supports RSS - https://mjtsai.com/blog/2019/12/26/apple-news-no-longer-supports-rss/
Darpa head resigns, moving on to industry - https://www.defensenews.com/breaking-news/2019/12/17/darpa-head-resigns-moving-on-to-industry/
Scientists Likely Found Way to Grow New Teeth for Patients - https://www.sciencetimes.com/articles/24252/20191111/scientists-likely-found-way-to-grow-new-teeth-for-patients.htm
```

```console
$ headless-eval -j https://news.ycombinator.com '[...document.querySelectorAll("a.storylink")].slice(0, 3).map(({ textContent: title, href }) => ({ title, href }))'
[
        {
                "title": "Apple News No Longer Supports RSS",
                "href": "https://mjtsai.com/blog/2019/12/26/apple-news-no-longer-supports-rss/"
        },
        {
                "title": "Darpa head resigns, moving on to industry",
                "href": "https://www.defensenews.com/breaking-news/2019/12/17/darpa-head-resigns-moving-on-to-industry/"
        },
        {
                "title": "Scientists Likely Found Way to Grow New Teeth for Patients",
                "href": "https://www.sciencetimes.com/articles/24252/20191111/scientists-likely-found-way-to-grow-new-teeth-for-patients.htm"
        }
]
```
