/// <reference path="Vector2" />

namespace core {
	
	export class DisplayObject {
		
		Position: Vector;
		Anchor: Vector;
		Size: Vector;
		Scale: Vector;
		Rotation: number;
		
		constructor(x: number, y: number, width: number, height: number)
		{
			this.Position = vector.New(x, y);
			this.Size = vector.New(width, height);
			this.Anchor = vector.New(0, 0);
			this.Scale = vector.New(1, 1);
			this.Rotation = 0;
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.save();
			ctx.translate(this.Position.x, this.Position.y);
			ctx.scale(this.Scale.x, this.Scale.y);
			ctx.rotate(this.Rotation);
			if (!vector.IsZero(this.Anchor)) {
				ctx.translate(-this.Anchor.x * this.Size.x, - this.Anchor.y * this.Size.y);
			}
			this.DrawSelf(ctx);
			ctx.restore();
		}
		
		protected DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			throw new Error('Unimplemented');
		}
		
		ToLocal(point: IVector): Vector;
		ToLocal(point: IVector, out: IVector): void;
		ToLocal(point: IVector, out?: IVector)
		{
			let local: IVector, tmp = vector.Tmp;
			
			if (out) {
				vector.Clone(point, out);
				local = out;
			}
			else {
				local = vector.Clone(point);
			}
			
			// Translation
			vector.Subtract(local, this.Position, local);
			// Scale
			vector.Clone(this.Scale, tmp);
			vector.Invert(tmp, tmp);
			vector.Multiply(local, tmp, local);
			// Rotation
			vector.Rotate(local, this.Rotation, local);
			// Anchor Translation
			vector.Clone(this.Anchor, tmp);
			vector.Multiply(tmp, this.Size, tmp);
			vector.Add(local, tmp, local);
			
			if (!out) return <Vector>local;
		}
		
		IsPointInside(point: IVector): boolean
		{
			let p = this.ToLocal(point);
			
			let xAxis = p.x > 0 && p.x < this.Size.x;
			let yAxis = p.y > 0 && p.y < this.Size.y;
			return xAxis && yAxis;
		}
		
	}
	
}