export function yhdistaAjot(paikallinen, pilvi) {
  const done = {
    ...(pilvi?.done || {}),
    ...(paikallinen?.done || {})
  };

  const ajot = new Map();

  for (const ajo of [
    ...(pilvi?.rideLog || []),
    ...(paikallinen?.rideLog || [])
  ]) {
    const tunniste = [
      ajo.started,
      ajo.ended,
      ajo.distance
    ].join("|");

    if (!ajot.has(tunniste)) {
      ajot.set(tunniste, ajo);
    }
  }

  const rideLog = [...ajot.values()].sort(
    (a, b) => new Date(b.started) - new Date(a.started)
  );

  return {
    done,
    rideLog,
    totalRide: Math.max(
      rideLog.reduce(
        (summa, ajo) => summa + (Number(ajo.distance) || 0),
        0
      ),
      Number(paikallinen?.totalRide) || 0,
      Number(pilvi?.totalRide) || 0
    )
  };
}
