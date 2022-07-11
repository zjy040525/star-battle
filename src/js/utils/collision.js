const collision = (target, entities, collidedCallback) => {
  const isCollided = (target, entity) => {
    const a = {
      x: target.offsetLeft,
      y: target.offsetTop,
      w: target.offsetWidth,
      h: target.offsetHeight,
    };
    const b = {
      x: entity.offsetLeft,
      y: entity.offsetTop,
      w: entity.offsetWidth,
      h: entity.offsetHeight,
    };
    return !(
      a.x > b.x + b.w ||
      a.x + a.w < b.x ||
      a.y > b.y + b.h ||
      a.y + a.h < b.y
    );
  };
  entities.forEach((entity) => {
    if (isCollided(target, entity)) {
      entity.collidedFrom = target;
      collidedCallback?.(target, entity);
    }
  });
};

export default collision;
