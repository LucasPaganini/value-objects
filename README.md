# Value Objects

## IMPORTANT: About the package size

NPM's "Unpacked Size" is innacurate because the package includes the source maps and files for easier debugging. Also, The `lib/` folder is a module aside, it includes some common use cases for the library but it's not included in the main bundle, it's just there for your convenience. I'd bet that most users won't touch the `lib/`, so, the accurate size of this library for most users is this:

|                         |     Size |
| :---------------------- | -------: |
| Unpacked                | 40.91 KB |
| Minified bundle         | 16.08 KB |
| Gzipped minified bundle |  3.73 KB |
