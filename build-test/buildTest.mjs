// test/buildTest.mjs
import { assert, expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Comprehensive Production Build Tests', () => {
  const buildDir = path.join(__dirname, '../build');

  it('should contain an index.html file', () => {
    const indexPath = path.join(buildDir, 'index.html');
    const exists = fs.existsSync(indexPath); // Check if file exists
    assert.isTrue(exists, 'index.html should exist'); // Assert using assert
  });

  it('should contain a <title> tag in index.html', () => {
    const indexPath = path.join(buildDir, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    expect(htmlContent).to.include('<title>');
  });

  // it('should contain a <meta charset="UTF-8"> tag in index.html', () => {
  //   const indexPath = path.join(buildDir, 'index.html');
  //   const htmlContent = fs.readFileSync(indexPath, 'utf-8').toLowerCase();
  //   expect(htmlContent).to.include('<meta charset="utf-8">');
  // });

  it('should have a bundle.js file', () => {
    const jsDir = path.join(buildDir, 'static/js');
    const files = fs.readdirSync(jsDir);
    const bundleFile = files.find((file) => file.startsWith('main') && file.endsWith('.js'));
    assert.exists(bundleFile, 'bundle.js should exist');
  });

  it('should contain valid JavaScript in the bundle.js file', () => {
    const jsDir = path.join(buildDir, 'static/js');
    const files = fs.readdirSync(jsDir);
    const bundleFile = files.find((file) => file.startsWith('main') && file.endsWith('.js'));
    if (bundleFile) {
      const bundlePath = path.join(jsDir, bundleFile);
      const bundleContent = fs.readFileSync(bundlePath, 'utf-8');
      expect(bundleContent).to.match(/var|function|const|let/); // Check for typical JS keywords
    }
  });

  it('should contain a main CSS file', () => {
    const cssDir = path.join(buildDir, 'static/css');
    const files = fs.readdirSync(cssDir);
    const cssFile = files.find((file) => file.startsWith('main') && file.endsWith('.css'));
    assert.exists(cssFile, 'main.css should exist');
  });

  it('should have all required assets in place', () => {
    const assetDir = path.join(buildDir, 'static/media');
    const assetsExist = fs.existsSync(assetDir);
    assert.isTrue(assetsExist, 'assets should exist');

    if (assetsExist) {
      const assets = fs.readdirSync(assetDir);
      expect(assets.length).to.be.greaterThan(0); // Expect at least one asset
    }
  });

  it('should contain a favicon in the build directory', () => {
    const faviconPath = path.join(buildDir, 'favicon.ico');
    // expect(fs.existsSync(faviconPath)).to.be.true;
    const exists = fs.existsSync(faviconPath); // Check if file exists
    assert.isTrue(exists, 'favicon.ico should exist'); // Assert using assert
  });

  it('should have the correct DOCTYPE in index.html', () => {
    const indexPath = path.join(buildDir, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    expect(htmlContent).to.match(/^<!doctype html>/i); // Ensure that the DOCTYPE is HTML5
  });

  it('should include a viewport meta tag for responsive design', () => {
    const indexPath = path.join(buildDir, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8').toLowerCase();
    expect(htmlContent).to.match(/<meta\s+name="viewport".*content="width=device-width/i);
  });

  it('should contain script tags pointing to JS bundles in index.html', () => {
    const indexPath = path.join(buildDir, 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    // Adjust the regex to be more flexible with spaces or casing
    expect(htmlContent).to.match(/<script\s+src=".*\/static\/js\/main.*\.js"><\/script>/i);
  });
});
