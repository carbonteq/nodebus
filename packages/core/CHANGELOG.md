# @nodebus/core

## 0.3.2

### Patch Changes

- 57fe3e3: Minify build files
- e45e482: Remove default key from export map

## 0.3.1

### Patch Changes

- 3fa6c5c: Change licence to MIT, and change tsconfig file to extend from nodebus.json
- 9d7bd0d: Fix: tsconfig include paths must be re-added (due to relative path stuff)
- b319494: rename withHandler -> addHandler in bus

## 0.3.0

### Minor Changes

- 41b62af: Add logger to bus

## 0.2.4

### Patch Changes

- bbbafdb: Pino Logger now checks the validity of log level from env

## 0.2.3

### Patch Changes

- d4cd7a1: Add logger interface and pino logger impl

## 0.2.0

### Minor Changes

- 631322d: Simplify Core API (internal+external)

### Patch Changes

- 612d03c: Fix tests and JsonSerializer types
- 612d03c: Add initial version of Bus API (and tests)
- 0ea435b: Internal: Move base interfaces to separate dir
- 3c3afaa: Add tests for in-memory queue transport

## 0.1.3

### Patch Changes

- Test release files

## 0.1.1

### Patch Changes

- 1e628dd: Add LocalBus (and required dependencies + tests)

## 0.1.0

### Minor Changes

- cbb004b: Add local bus impl

### Patch Changes

- d22522f: Add default handler registery implementation for nodebus-core

## 0.0.2

### Patch Changes

- 7d8afe1: Add base interfaces and json serializer
