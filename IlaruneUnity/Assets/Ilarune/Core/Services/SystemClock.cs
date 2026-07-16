using System;
using Ilarune.Shared;

namespace Ilarune.Core
{
    public sealed class SystemClock : IClock
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }
}
