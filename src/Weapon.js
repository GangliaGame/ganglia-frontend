class Bullet extends Phaser.Sprite {
  constructor(game, key, isPlayer = false) {
    super(game, 0, 0, key)
    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST
    this.anchor.set(0.5)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.exists = false
    this.scale.set(this.game.scaleFactor * 1.5, this.game.scaleFactor * 1.5)
    this.scale.x = isPlayer ? -this.scale.x : this.scale.x
  }

  fire(x, y, angle, speed) {
    this.reset(x, y)
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity)
  }
}

export default class Weapon extends Phaser.Group {
  constructor(ship, bulletDamage = 10, bulletColor = 'R', yOffset = 0, angle = 0) {
    super(ship.game, ship.game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE)
    this.ship = ship

    this.nextFire = 0
    this.bulletDamage = bulletDamage
    this.bulletVelocity = 2000
    this.isPlayerWeapon = ship.key === 'player'
    this.bulletVelocity = this.isPlayerWeapon ? this.bulletVelocity : -this.bulletVelocity
    this.fireRate = 500
    this.yOffset = yOffset

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200)
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200))

    this.patternIndex = 0

    for (let i = 0; i < 64; i++) {
      const bullet = new Bullet(this.game, `bullet_${bulletColor}`, this.isPlayerWeapon)
      bullet.angle = angle
      this.add(bullet, true)
    }
  }

  fire() {
    if (this.game.time.time < this.nextFire) return

    const x = this.ship.x
    const y = this.ship.y + this.yOffset

    this.getFirstExists(false).fire(x, y, 0, this.bulletVelocity, 0, 600)
    this.nextFire = this.game.time.time + this.fireRate
  }
}
