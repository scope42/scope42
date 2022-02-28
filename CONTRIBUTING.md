# Contributing

## Changing item properties

This is a checklist of places to keep in mind when chenaging an item property. This is especially important for adding new ones because the compiler won't help you.

- Type defintion in `src/data/types.ts`
- Corresponding item editor in `src/components/ItemEditor`
- Page header of item page in `src/pages`
- Graph generation in `src/components/Graph.ts` if this is a relation. Consider both sides of the relation!
