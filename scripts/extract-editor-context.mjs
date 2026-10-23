// Build the UI prototype's initial content from the public page source, without
// executing page components. Runtime API integration will replace these fixtures.
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
const pages = {
  "who-we-are": "WhoWeAre",
  "how-we-do-it": "HowWeDoIt",
  "why-we-do-it": "WhyWeDoIt",
  board: "Board",
  team: "Team",
  consultancy: "Consultancy",
  "managed-services": "ManagedServices",
  training: "Training",
  cybershield: "Cybershield",
  "software-products": "SoftwareProducts",
  "rwanda-dpp-registration": "RwandaDpp",
  blog: "Blog",
  sdg: "Sdg",
  "join-our-team": "Careers",
  "talent-shield": "TalentShield",
};
const output = {};
const clean = (text) =>
  text
    .replace(/\s+/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .trim();
for (const [id, file] of Object.entries(pages)) {
  const source = ts.createSourceFile(
    file,
    readFileSync(`src/components/site/${file}Page.tsx`, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const constants = {};
  const media = {};
  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.importClause?.name &&
      /\.(png|jpe?g|webp|svg|mp4|pdf)$/.test(statement.moduleSpecifier.text)
    ) {
      media[statement.importClause.name.text] = statement.moduleSpecifier.text.replace(
        "@/",
        "/src/",
      );
    }
  }
  function value(node) {
    if (!node) return undefined;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isNumericLiteral(node)) return node.text;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node))
      return value(node.expression);
    if (ts.isIdentifier(node)) return media[node.text] ?? constants[node.text];
    if (ts.isArrayLiteralExpression(node))
      return node.elements.map(value).filter((v) => v !== undefined);
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.filter(ts.isPropertyAssignment).flatMap((p) => {
          const v = value(p.initializer);
          return v === undefined ? [] : [[p.name.getText(source).replaceAll('"', ""), v]];
        }),
      );
    return undefined;
  }
  function textOf(node) {
    if (ts.isJsxText(node)) return node.text;
    if (ts.isJsxExpression(node))
      return typeof value(node.expression) === "string" ? value(node.expression) : "";
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children.map(textOf).join(" ");
    return "";
  }
  function attrs(node) {
    return Object.fromEntries(
      node.attributes.properties
        .filter(ts.isJsxAttribute)
        .map((a) => [
          a.name.text,
          a.initializer &&
            (ts.isJsxExpression(a.initializer)
              ? value(a.initializer.expression)
              : value(a.initializer)),
        ]),
    );
  }
  function descendants(node, tag) {
    const found = [];
    function visit(child) {
      if (ts.isJsxElement(child) && child.openingElement.tagName.getText(source) === tag)
        found.push(child);
      ts.forEachChild(child, visit);
    }
    visit(node);
    return found;
  }
  for (const statement of source.statements)
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const v = value(declaration.initializer);
        if (v !== undefined) constants[declaration.name.getText(source)] = v;
      }
    }
  const sections = [];
  let hero = {};
  function walk(node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === "PageHero") {
      hero = attrs(node);
      const lead = node.attributes.properties.find(
        (a) => ts.isJsxAttribute(a) && a.name.text === "lead",
      );
      if (lead?.initializer && ts.isJsxExpression(lead.initializer))
        hero.lead = clean(textOf(lead.initializer.expression));
    }
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === "section") {
      // Top-level sections only; nested cards belong to their parent section.
      let parent = node.parent;
      let nested = false;
      while (parent) {
        if (ts.isJsxElement(parent) && parent.openingElement.tagName.getText(source) === "section")
          nested = true;
        parent = parent.parent;
      }
      if (!nested) {
        const a = attrs(node.openingElement);
        const headings = [...descendants(node, "h2"), ...descendants(node, "h3")]
          .map((n) => clean(textOf(n)))
          .filter(Boolean);
        const paragraphs = descendants(node, "p")
          .map((n) => clean(textOf(n)))
          .filter(Boolean);
        const lists = [];
        const images = [];
        function scan(child) {
          if (
            ts.isJsxSelfClosingElement(child) &&
            child.tagName.getText(source) === "SectionHeading"
          ) {
            for (const attribute of child.attributes.properties.filter(ts.isJsxAttribute)) {
              if (!attribute.initializer) continue;
              const content = ts.isJsxExpression(attribute.initializer)
                ? clean(
                    textOf(attribute.initializer.expression) ||
                      String(value(attribute.initializer.expression) ?? ""),
                  )
                : String(value(attribute.initializer) ?? "");
              if (content && attribute.name.text === "title") headings.unshift(content);
              if (content && ["intro", "eyebrow"].includes(attribute.name.text))
                paragraphs.unshift(content);
            }
          }
          if (
            ts.isCallExpression(child) &&
            ts.isPropertyAccessExpression(child.expression) &&
            child.expression.name.text === "map" &&
            ts.isIdentifier(child.expression.expression)
          ) {
            const name = child.expression.expression.text;
            if (Array.isArray(constants[name]) && !lists.some((l) => l.key === name))
              lists.push({ key: name, items: constants[name] });
          }
          if (ts.isJsxSelfClosingElement(child) && child.tagName.getText(source) === "img") {
            const image = attrs(child);
            if (image.src) images.push({ src: image.src, alt: image.alt ?? "" });
          }
          ts.forEachChild(child, scan);
        }
        scan(node);
        if (headings.length || paragraphs.length || lists.length || images.length)
          sections.push({
            id:
              a.id ??
              a["aria-labelledby"]?.replace(/-title$/, "") ??
              `section-${sections.length + 1}`,
            label: headings[0] ?? a["aria-label"] ?? "Page section",
            headings,
            paragraphs,
            lists,
            images,
          });
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
  output[id] = { hero, media, sections, constants };
}
writeFileSync("src/content/admin-page-context.json", JSON.stringify(output, null, 2) + "\n");
