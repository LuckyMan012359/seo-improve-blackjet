<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          a {
            color: #0073e6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
                </style>
            </head>
            <body>
                <h1>XML Sitemap</h1>
                <table>
                    <tr>
                        <th>URL</th>
                    </tr>
                    <xsl:for-each select="urlset/url">
                        <tr>
                            <td>
                                <a href="{loc}">
                                    <xsl:value-of select="loc"/>
                                </a>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
