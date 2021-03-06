/// <reference path="Utils" />

namespace core {
	
	interface ITimerCallback
	{
		(timeDelta: number);
	}
	
	export class Timer
	{
		ElapsedTime: number = 0;
		CallCount: number = 0;
		
		constructor(
			public Callback: ITimerCallback,
			public Ctx: any,
			public Delay: number,
			public Interval: number = NaN,
			/** How many times this callback can be called */
			public CallLimit: number = 0
		) { }
		
		Update(timeDelta): void
		{
			this.ElapsedTime += timeDelta;
			
			if (this.ElapsedTime > this.Delay)
			{
				if (this.CallLimit > 0 && this.CallCount > this.CallLimit - 1) return;
				
				if (this.CallCount === 0) 
				{
					this.Callback.call(this.Ctx, timeDelta);
					this.CallCount += 1;
				}
				
				
				if (this.ElapsedTime - this.Delay > this.Interval * this.CallCount)
				{
					this.Callback.call(this.Ctx, timeDelta)
					this.CallCount += 1;
				}
			}
		}
	}
	
	export class TimersManager
	{
		Timers: Timer[] = [];
		
		Delay(delay: number, callback: ITimerCallback, ctx?: any): Timer
		{
			let timer;
			
			this.Timers.push(timer = new Timer((...args) =>
			{
				TryRemoveElement(this.Timers, timer);
				callback.apply(ctx, args);
				
			}, ctx, delay));
			
			return timer;
		}
		
		Repeat(interval: number, callback: ITimerCallback, ctx?: any, callLimit?: number, delay: number = 0): Timer
		{
			let timer;
			
			this.Timers.push(timer = new Timer(callback, ctx, delay, interval, callLimit));
			
			return timer;
		}
		
		Update(timeDelta: number): void
		{
			for(let timer of this.Timers) timer.Update(timeDelta);
		}
		
		RemoveAll(): void
		{
			this.Timers = [];
		}
	}
}